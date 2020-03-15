import {writable} from "svelte/store";
import {setContext} from "svelte";
import {init, apply, changed} from './state';
import {del_keys} from './utils';

export const name = 'index';
export const events = ['create'];

export function define(config) { 
    const {form, state} = create(config);
    setContext('form', form);
    setContext('state', state);
    return {form, state};
}

const plugins = [
    require('./plugins/dirty'),
    require('./plugins/filtering'),
    require('./plugins/focus'),
    require('./plugins/validation'),
];

export function create(config) {
    let values = {...config.values};

    const form = writable(values);
    const state = writable({
        ...init({plugins, ...config}),

        setFormValue(key, value) {
            form.update(values => {
                values[key] = value;
                return values;
            })
        }
    });

    form.subscribe(values => {
        state.update(_state => changed(_state, values));
    });

    return apply(plugins.concat([finalize]), 'create', {values, form, state});
}

const finalize = {
    create(result) {
        const state = {...result.state};
        return {
            ...del_keys(result, 'values'),
            state: del_keys(state, 'update', 'set')
        };
    }
};

export default {define, create};
