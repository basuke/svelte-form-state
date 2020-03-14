import {validateValue} from './state';
import {keys, obj_diff_keys} from './utils';

export const name = "focus";

export const events = ['onFocus', 'onBlue'];

export function prepare(config) {
    return config;
}

export function init(_state) {
    return {..._state, focus: null, pendingKeys: new Set()};
}

export function create(result) {
    const {form, state, values} = result;

    form.focus = keys(values).reduce((obj, key) => {
        obj[key] = () => state.update(state => focus(state, key));
        return obj;
    }, {});

    form.blur = () => {
        state.update(state => {
            return blur(state);
        });
    };

    return {...result, form};
}

export function shouldSyncValue([state, key, flag]) {
    const {focus} = state;
    flag = flag && (focus !== key);
    return [state, key, flag];
}

export function valuesChanged(state) {
    return state;
}

function focus(state, key) {
    const {errors, pendingKeys} = state;

    if (errors[key]) {
        delete errors[key];
        pendingKeys.add(key);
    }

    return {...state, errors, focus: key, pendingKeys};
}

function blur(state) {
    const {pendingKeys, setFormValue, values} = state;
    for (const key of Array.from(pendingKeys)) {
        setFormValue(key, values[key]);
        validateValue(state, key, values[key]);
    }
    return {...state, focus: null, pendingKeys: new Set()};
}

export default {name, events, prepare, init, create, valuesChanged, shouldSyncValue};
