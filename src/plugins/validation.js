import { keys } from '../utils';
import { get } from 'svelte/store';

export const name = "validation";

function addItem(errors, name, value) {
    if (!(name in errors)) {
        errors[name] = [];
    }

    errors[name].push(value);
}

export function init(state) {
    const {config: {validators = []}} = state;
    return {
        ...state,
        validators,
        errors: {},
        customErrors: {},
        validationPending: new Set(),
        valid: undefined
    };
}

export function create(result) {
    const {form, state} = result;

    form.validate = () => {
        state.update(_state => validateValues(_state, true));

        const {valid} = get(state);
        return valid;
    };

    form.addCustomError = (name, error) => {
        state.update(_state => {
            const {customErrors} = _state;
            addItem(customErrors, name, error);
            return validateValues(_state);
        });
    };

    form.clearCustomErrors = (name = undefined) => {
        state.update(_state => {
            let {customErrors} = _state;
            if (name === undefined) {
                customErrors = {};
            } else {
                delete customErrors[name];
            }

            return validateValues({..._state, customErrors});
        });
    };

    return result;
}

export function didFocus([state, key]) {
    const {errors, validationPending} = state;
    if (errors[key])
        delete errors[key];
    validationPending.add(key);
    return [state, key];
}

export function didBlur(state) {
    return {...state, validationPending: new Set()};
}

export function willSync([state, values]) {
    const {validators, validationPending: pending, dirty = undefined} = state;

    const shouldValidate = key => key in validators && !pending.has(key) && (!dirty || dirty.has(key));

    for (const key of keys(values).filter(shouldValidate)) {
        validateValue(state, key, values[key]);
    }

    return [{...state, valid: undefined}, values];
}

function validateValues(state, force = false) {
    const {validators, values, dirty} = state;

    for (const key of keys(validators)) {
        if (force || dirty.has(key)) {
            validateValue(state, key, values[key]);
            dirty.add(key);
        }
    }

    const valid = keys(state.errors).length == 0;

    return {
        ...state,
        valid,
    };
}

function validateValue(state, key, value) {
    const {validators, errors, customErrors} = state;

    errors[key] = validators[key].reduce((result, validator) => {
        const error = validator({key, value, errors: result});
        return error ? [...result, error] : result;
    }, []);

    if (key in customErrors) {
        errors[key] = [...errors[key], ...customErrors[key]];
    }

    if (!errors[key].length)
        delete errors[key];
}

export default {name, init, create, didFocus, didBlur, willSync};
