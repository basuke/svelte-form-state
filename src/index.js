import {setContext} from "svelte";
import {apply, sync} from './state';
import {create as createForm} from './form';

export {apply, sync} from './state';
export * from './utils';

export const defaultPlugins = [
    require('./plugins/dirty'),
    require('./plugins/filtering'),
    require('./plugins/focus'),
    require('./plugins/validation'),
];

export function create(config) {
    if (!('plugins' in config))
        config.plugins = defaultPlugins;

    return createForm(config);
}

export function define(config) { 
    const {form, state} = result = create(config);

    setContext('form', form);
    setContext('state', state);
    return result;
}

export default {define, create, apply, sync};
