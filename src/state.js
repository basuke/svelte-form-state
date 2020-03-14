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

export function changed(state, newValues) {
    const diff_keys = obj_diff_keys(state.values, newValues);
    if (diff_keys.length == 0)
        return state;

    const {plugins} = state;

    for (const key of diff_keys) {
        let value = newValues[key];

        state.values[key] = value;

        let result = apply(plugins, 'valueChanged', [state, key, value]);
        state = result[0];
        value = result[2];

        result = apply(plugins, 'shouldSyncValue', [state, key, true]);
        state = result[0];
        const doIt = result[2];
        if (doIt)
            state.setFormValue(key, value);

        // if (shouldValidateWhileEditing(key, focus))
        //     validateValue(state, key, value);
        // else
        //     pendingKeys.add(key);
    }

    delete state.key;
    delete state.value;
    return state;
}

function filterValue([state, key, value]) {
    const {filters} = state;

    if (filters[key]) {
        for (const filter of filters[key]) {
            value = filter(value);
        }
        state.values[key] = value;
    }

    return [state, key, value];
}

export default {init};
