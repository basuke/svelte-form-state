export const name = "filter";

export function init(_state) {
    const {config: {filters = []}} = _state;
    return {..._state, filters};
}

export function valueChanged([state, key, value]) {
    const {filters} = state;

    if (filters[key]) {
        for (const filter of filters[key]) {
            value = filter(value);
        }
        state.values[key] = value;
    }

    return [state, key, value];
}

export default {name, init, valueChanged};
