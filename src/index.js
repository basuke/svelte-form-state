import {writable, get} from "svelte/store";
import {setContext} from "svelte";
import {init, changed, validate, validateValue} from './state';
import {keys, obj_diff_keys} from './utils';

export function define(config) { 
    const {form, state} = create(config);
    setContext('form', form);
    setContext('state', state);
    return {form, state};
}

export function create(config) {
    let values = {...config.values};

    const formStore = writable(values);
    const stateStore = writable(init(config));

    formStore.subscribe(values => {
        stateStore.update(state => changed(state, values));
    });

    return {
        form: {
            ...formStore,

            focus: keys(values).reduce((obj, key) => {
                obj[key] = () => stateStore.update(state => focus(state, key));
                return obj;
            }, {}),

            blur: () => {
                stateStore.update(state => {
                    const newState = blur(state);
                    const keys = obj_diff_keys(newState.values, values);
                    if (keys.length) {
                        for (const key of obj_diff_keys(state.values, values)) {
                            values[key] = state.values[key];
                        }
                        formStore.set(values);
                    }
                    return newState;
                });
            },

            validate: () => {
                stateStore.update(state => validate(state));
            }
        },
        state: {
            subscribe: stateStore.subscribe,
            isDirty: name => get(stateStore).dirty.has(name),
        }
    };
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

export default {define, create};
