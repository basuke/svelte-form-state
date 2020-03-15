import {obj_diff_keys, keys, is_callable, obj_subset, del_keys, obj_update} from './utils';

export const name = 'state';
export const events = ['init', 'change', 'willSync'];

export function init(config) {
    const {values = {}, plugins = []} = config;

    const state = {
        config,
        values,
        plugins,
    };

    return apply(
        plugins,
        'init',
        state,
        state => del_keys(state, 'config')
    );
}

/**
 * Apply plugin's methods.
 * @param array plugins 
 * @param string method 
 * @param any initial 
 */
export function apply(plugins, method, initial, finalize = null) {
    if (finalize) {
        const finalizer = {};
        finalizer[method] = finalize;
        plugins = plugins.concat(finalizer);
    }

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
    const changedValues = obj_subset(values, diff_keys);

    [state, values] = apply(plugins, 'changed', [state, changedValues], ([state, values]) => {
        obj_update(state.values, values);
        return [state, values];
    });

    return sync(state, values);
}

export function sync(state, values) {
    const {plugins} = state;

    return apply(plugins, 'willSync', [state, values], ([state, values]) => {
        for (const key of keys(values)) {
            state.setFormValue(key, state.values[key]);
        }
        return state;
    });
}
