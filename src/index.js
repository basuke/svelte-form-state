import {setContext} from "svelte";
import {apply, sync} from './state';
import {create as createForm} from './form';

import dirtyPlugin from './plugins/dirty';
import filteringPlugin from './plugins/filtering';
import focusPlugin from './plugins/focus';
import validationPlugin from './plugins/validation';

export const defaultPlugins = [
    dirtyPlugin,
    filteringPlugin,
    focusPlugin,
    validationPlugin,
];

export {apply, sync} from './state';
export * from './utils.ts';
export * from './validators';
export * from './filters';

export function create(values, config, plugins) {
    if (typeof values !== 'object')
        throw "Values must be object to define initial values of form";
    if (config === undefined) {
        if ('values' in values) {
            config = values;
        } else {
            config = {values};
        }
    } else {
        if ('values' in config) {
            throw "Duplicate definitions of values: first argument and config.values";
        }
        config.values = values;
    }

    if (plugins !== undefined) {
        config.plugins = plugins;
    }

    if (!('plugins' in config)) {
        config.plugins = defaultPlugins;
    }

    return createForm(config);
}

export function define(values, config, plugins) { 
    const {form, state} = create(values, config, plugins);

    setContext('form', form);
    setContext('state', state);
    return {form, state};
}

export default {define, create, apply, sync};
