import {create} from "../src/index.js";
import {get} from "svelte/store";

it("tests filter", () => {
    const {form, state} = create({
        values: {name: ""},
        filters: {
            name: [value => value + "!!!!"]
        }
    });

    form.update(values => {
        values.name = "Hello";
        return values;
    });

    expect(get(state).values.name).toBe("Hello!!!!");
    expect(get(form).name).toBe("Hello!!!!");
});

it("tests filter with focus", () => {
    const {form, state} = create({
        values: {name: ""},
        filters: {
            name: [value => value + "!!!!"]
        }
    });

    form.focus.name();

    form.update(values => {
        values.name = "Hello";
        return values;
    });

    expect(get(state).values.name).toBe("Hello!!!!");
    expect(get(form).name).toBe("Hello");

    form.blur();

    expect(get(state).values.name).toBe("Hello!!!!");
    expect(get(form).name).toBe("Hello!!!!");
});

it("tests filtering plugin is disabled when no configuration", () => {
    const plugin = require('../src/plugins/filtering');
    expect(plugin.qualify({})).toBeFalsy();
    expect(plugin.qualify({filters: { name: [] }})).toBeTruthy();
    expect(plugin.qualify({filters: {}})).toBeFalsy();
});
