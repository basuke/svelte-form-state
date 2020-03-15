import {get} from "svelte/store";
import {keys} from "./utils";

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

    return {
        ...result,
        state: {
            ...state,
            isDirty: name => dirty.has(name),
        }
    };
}

export function changed([state, values]) {
    keys(values).forEach(key => state.dirty.add(key));
    return [state, values];
}

export default {name, init, changed};
