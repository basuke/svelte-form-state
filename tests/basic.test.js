import {create} from "../src/index.js";
import {is_callable} from "../src/utils.js";
import {get} from "svelte/store";

test('basic feature', () => {
    const {form, state} = create({
        values: {name: "", email: "", admin:false}
    });

    expect(is_callable(form.subscribe)).toBeTruthy();

    // Update values

    expect(state.isDirty('name')).toBeFalsy();

    form.update(values => {
        values.name = "Basuke";
        return values;
    });

    expect(state.isDirty('name')).toBeTruthy();
    expect(get(form).name).toBe("Basuke");

    // Focus

    expect(get(state).focus).toBeNull();
    form.focus.email();
    expect(get(state).focus).toBe('email');
    form.blur();
    expect(get(state).focus).toBeNull();
    expect(state.isDirty('email')).toBeFalsy();
});

