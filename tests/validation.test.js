import {create} from "../src/index.js";
import {get} from "svelte/store";

it("tests validation", () => {
    const {form, state} = create({
        values: {name: ""},
        validators: {
            name: [({value}) => value ? "" : "required"]
        }
    });

    form.update(values => {
        values.name = "Hello";
        return values;
    });

    expect(get(state).errors['name']).toBeUndefined();

    form.update(values => {
        values.name = "";
        return values;
    });

    expect(get(state).errors['name']).toEqual(['required']);
});
