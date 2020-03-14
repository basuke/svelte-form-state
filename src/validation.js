import {apply} from './state';

export function init(state) {
    const {config: {validators = []}} = state;
    return {...state, validators, errors: {}, valid: undefined};
}

export function valueChanged([state, key]) {
    const {plugins, values, pendingKeys} = state;
    const value = values[key];

    const [state1, _, doIt] = apply(plugins, 'shouldValidate', [state, key, true]);
    state = state1;

    if (doIt)
        validateValue(state, key, value);
    else
        pendingKeys.add(key);

    return [{...state, valid: undefined}, key];
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
