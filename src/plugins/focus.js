import {keys, obj_subset} from '../utils';
import {sync, apply} from '../state';

export const name = "focus";
export const events = ['didFocus', 'didBlur'];

export function prepare(config) {
    return config;
}

export function init(_state) {
    return {..._state, focus: null};
}

export function create(result) {
    const {form, state, values} = result;

    function doFocus(state, key) {
        const {plugins} = state;
    
        return apply(plugins, 'didFocus', [{...state, focus: key}, key], ([state, _]) => {
            return state;
        });
    }
    
    form.focus = keys(values).reduce((obj, key) => {
        obj[key] = () => state.update(state => doFocus(state, key));
        return obj;
    }, {});

    form.blur = () => {
        state.update(state => {
            const {plugins, focus, values} = state;
            state = apply(plugins, 'didBlur', {...state, focus: null});

            if (focus)
                state = sync(state, obj_subset(values, [focus]));

            return state;
        });
    };

    return {...result, form};
}

export function willSync([state, values]) {
    const {focus} = state;

    return [state, keys(values).reduce((filtered, key) => {
        if (key !== focus)
            filtered[key] = values[key];
        return filtered;
    }, {})];
}

export default {name, events, prepare, init, create, willSync};
