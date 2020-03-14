import {get} from "svelte/store";
export const name = "dirty";

export function init(_state) {
    return {
        ..._state,
        dirty: new Set(),
    };
}

export function create(result) {
    const {state} = result;
    state.isDirty = name => get(state).dirty.has(name);
    return {...result, state};
}

export function valueChanged([state, key, value]) {
    state.dirty.add(key);
    return [state, key, value];
}

export default {name, init, valueChanged};
