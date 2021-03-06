import {writable} from "svelte/store";
import {init, apply, changed} from './state';
import {del_keys} from './utils.ts';

export const name = 'form';
export const events = ['create'];

export function create(config) {
    let values = {...config.values};
    const {plugins = []} = config;

    const form = writable(values);

    form.setValue = function(key, value) {
        this.update(values => {
            values[key] = value;
            return values;
        })
    };

    const state = writable({
        ...init({plugins, ...config}),

        setFormValue(key, value) {
            form.setValue(key, value)
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
