import {keys, obj_diff_keys, is_callable} from './utils';

export function init(config) {
    const {values = {}, plugins = []} = config;

    const _state = {
        config,
        values,
        validators: [],
        plugins,
    };

    const finalize = {
        init(_state) {
            delete _state.config;
            return _state;
        }
    };
    return apply(plugins.concat(finalize), 'init', _state);
}

/**
 * Apply plugin's methods.
 * @param array plugins 
 * @param string method 
 * @param any initial 
 */
export function apply(plugins, method, initial) {
    return plugins
        .filter(plugin => is_callable(plugin[method]))
        .reduce(
            (value, plugin) => plugin[method](value),
            initial);
}

function shouldValidateWhileEditing(key, focus) {
    if (focus == key) return false;
    return true;
}

export function changed(state, newValues) {
    const diff_keys = obj_diff_keys(state.values, newValues);
    if (diff_keys.length == 0)
        return state;

    const {plugins, focus, pendingKeys} = state;

    const [newState, filteredValues] = filter([state, newValues]);
    newState.values = filteredValues;

    for (const key of diff_keys) {
        const value = newState.values[key];
        newState.setFormValue(key, value);

        newState.key = key;
        newState.value = value;
        apply(plugins, 'valueChanged', newState);

        if (shouldValidateWhileEditing(key, focus))
            validateValue(newState, key, value);
        else
            pendingKeys.add(key);
    }

    delete newState.key;
    delete newState.value;
    return {...newState, valid: undefined};
}

function filter([state, values]) {
    const filteredValues = keys(values).reduce((result, key) => {
        result[key] = filterValue(state, key, values[key]);
        return result;
    }, {});
    return [state, filteredValues];
}

function filterValue(state, key, value) {
    const {filters} = state;

    if (filters[key]) {
        for (const filter of filters[key]) {
            value = filter(value);
        }
    }
    return value;
}

export function validate(state) {
    const {validators, values} = state;

    for (const key of keys(validators)) {
        validateValue(state, key, values[key]);
    }

    const valid = keys(state.errors).length == 0;

    return {
        ...state,
        valid,
        dirty: new Set(keys(values)),
        pendingKeys: new Set(),
    };
}

export function validateValue(state, key, value) {
    const {validators, errors} = state;

    if (!validators[key])
        return true;

    errors[key] = validators[key].reduce((result, validator) => {
        const error = validator({key, value, errors: result});
        return error ? [...result, error] : result;
    }, []);

    if (errors[key].length)
        return false;

    delete errors[key];
    return true;
}

export default {init};
