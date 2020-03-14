import {obj_diff_keys, is_callable, del_keys} from './utils';

export function init(config) {
    const {values = {}, plugins = []} = config;

    const state = {
        config,
        values,
        plugins,
    };

    const finalize = {init: state => del_keys(state, 'config')};
    return apply(plugins.concat(finalize), 'init', state);
}

/**
 * Apply plugin's methods.
 * @param array plugins 
 * @param string method 
 * @param any initial 
 */
export function apply(plugins, method, initial) {
    return plugins
        .filter(plugin => is_callable(plugin[method]))
        .reduce(
            (value, plugin) => plugin[method](value),
            initial);
}

export function changed(state, values) {
    const diff_keys = obj_diff_keys(state.values, values);
    if (diff_keys.length == 0)
        return state;

    const {plugins} = state;

    for (const key of diff_keys) {
        let value = values[key];

        state.values[key] = value;

        state = apply(plugins, 'valueChanged', [state, key])[0];

        const [state1, _, doIt] = apply(plugins, 'shouldSyncValue', [state, key, true]);
        state = state1;
        if (doIt)
            state.setFormValue(key, state.values[key]);
    }

    return state;
}

export default {init, apply, changed};
