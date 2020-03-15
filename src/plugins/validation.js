import { keys } from '../utils';

export const name = "validation";

export function init(state) {
    const {config: {validators = []}} = state;
    return {
        ...state,
        validators,
        errors: {},
        validationPending: new Set(),
        valid: undefined
    };
}

export function didFocus([state, key]) {
    const {errors, validationPending} = state;
    if (errors[key])
        delete errors[key];
    validationPending.add(key);
    return [state, key];
}

export function didBlur(state) {
    return state;
}

export function willSync([state, values]) {
    const {validators, validationPending} = state;
    for (const key of keys(values).filter(key => key in validators && !validationPending.has(key))) {
        validateValue(state, key, values[key]);
    }

    return [{...state, valid: undefined}, values];
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
        validationPending: new Set(),
    };
}

function validateValue(state, key, value) {
    const {validators, errors} = state;

    errors[key] = validators[key].reduce((result, validator) => {
        const error = validator({key, value, errors: result});
        return error ? [...result, error] : result;
    }, []);

    if (!errors[key].length)
        delete errors[key];
}

export default {name, init, didFocus, didBlur, willSync, validate};
