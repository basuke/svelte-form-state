import {writable, get} from "svelte/store";
import {setContext} from "svelte";
import {init, apply, changed, validate} from './state';

export function define(config) { 
    const {form, state} = create(config);
    setContext('form', form);
    setContext('state', state);
    return {form, state};
}

const plugins = [
    {
        name: "filter",
        init: function init(_state) {
            const {config: {filters = []}} = _state;
            return {..._state, filters};
        }
    },
    {
        name: "dirty",
        init: function init(_state) {
            return {
                ..._state,
                dirty: new Set(),
            };
        },
        valueChanged: function valueChanged(_state) {
            const {key} = _state;
            _state.dirty.add(key);
            return _state;
        }
    },
    require('./focus'),
    {
        name: "validation",
        init: function init(_state) {
            return {
                ..._state,

                pendingKeys: new Set(),
                errors: {},
                valid: undefined,
            }
        },
    },
];

export function create(config) {
    let values = {...config.values};

    config = apply(plugins, 'reduce', config);

    const formStore = writable(values);
    const stateStore = writable({
        ...init({plugins, ...config}),

        setFormValue(key, value) {
            formStore.update(values => {
                values[key] = value;
                return values;
            })
        }
    });

    formStore.subscribe(values => {
        stateStore.update(state => changed(state, values));
    });

    const finalize = {
        create(result) {
            const state = {...result.state};
            delete state.update;
            delete state.set;

            delete result.values;

            return {...result, state};
        }
    };
    return apply(plugins.concat([finalize]), 'create', {
        values,
        form: {
            ...formStore,

            validate: () => {
                stateStore.update(state => validate(state));
            }
        },
        state: {
            ...stateStore,
            isDirty: name => get(stateStore).dirty.has(name),
        }
    });
}

export default {define, create};
