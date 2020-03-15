import {keys} from "../utils";

export const name = "filter";

export function init(_state) {
    const {config: {filters = []}} = _state;
    return {..._state, filters};
}

export function changed([state, values]) {
    const {filters} = state;

    keys(values)
        .filter(key => key in filters)
        .forEach(key => {
            let value = values[key];

            for (const filter of filters[key]) {
                value = filter(value);
            }
            values[key] = value;
        });

    return [state, values];
}

export default {name, init, changed};
