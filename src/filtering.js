export const name = "filter";

export function init(_state) {
    const {config: {filters = []}} = _state;
    return {..._state, filters};
}

export function valueChanged([state, key]) {
    const {filters, values} = state;
    let value = values[key];

    if (filters[key]) {
        for (const filter of filters[key]) {
            value = filter(value);
        }
        values[key] = value;
    }

    return [state, key];
}

export default {name, init, valueChanged};
