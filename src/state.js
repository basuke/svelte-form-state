import {keys, obj_diff_keys} from './utils';

export function init({
    values = {},
    validators = {},
    filters = {}
}) {
    const state = {
        values,
        validators,
        filters,
        dirty: new Set(),
        focus: null,
        pendingKeys: new Set(),
        errors: {},
        valid: undefined,
    };

    return state;
}

function shouldValidateWhileEditing(key, focus) {
    if (focus == key) return false;
    return true;
}

export function changed(state, newValues) {
    const {focus, dirty, values, pendingKeys} = state;

    const filteredValues = filter(state, newValues);

    for (const key of obj_diff_keys(values, filteredValues)) {
        // update value
        const value = values[key] = filteredValues[key];

        // make it dirty
        dirty.add(key);

        if (shouldValidateWhileEditing(key, focus))
            validateValue(state, key, value);
        else
            pendingKeys.add(key);
    }

    return {...state, valid: undefined};
}

function filter(state, values) {
    return keys(values).reduce((result, key) => {
        result[key] = filterValue(state, key, values[key]);
        return result;
    }, {});
}

function filterValue(state, key, value) {
    const {filters} = state;

    if (filters[key]) {
        for (const filter of filters[key]) {
            value = filter({...state, key, value});
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
