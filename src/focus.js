import {validateValue} from './state';
import {keys, obj_diff_keys} from './utils';

export const name = "focus";

export const events = ['onFocus', 'onBlue'];

export function prepare(config) {
    return config;
}

export function init(_state) {
    return {..._state, focus: null};
}

export function create(result) {
    const {form, state, values} = result;

    form.focus = keys(values).reduce((obj, key) => {
        obj[key] = () => state.update(state => focus(state, key));
        return obj;
    }, {});

    form.blur = () => {
        state.update(state => {
            const newState = blur(state);
            const keys = obj_diff_keys(newState.values, values);
            if (keys.length) {
                for (const key of obj_diff_keys(state.values, values)) {
                    values[key] = state.values[key];
                }
                form.set(values);
            }
            return newState;
        });
    };

    return {...result, form};
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
    const {pendingKeys, values} = state;
    for (const key of Array.from(pendingKeys)) {
        validateValue(state, key, values[key]);
    }
    return {...state, focus: null, pendingKeys: new Set()};
}

export default {name, events, prepare, init, create};
