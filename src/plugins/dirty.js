import {get} from "svelte/store";
import {keys} from "../utils.ts";

export const name = "dirty";

export function init(_state) {
    return {
        ..._state,
        dirty: new Set(),
    };
}

export function create(result) {
    const {state} = result;
    const {dirty} = get(state);

    const isDirty = name => name ? dirty.has(name) : dirty.size > 0;

    return {
        ...result,
        state: {
            ...state,
            isDirty,
        }
    };
}

export function changed([state, values]) {
    keys(values).forEach(key => state.dirty.add(key));
    return [state, values];
}

export default {name, init, create, changed};
