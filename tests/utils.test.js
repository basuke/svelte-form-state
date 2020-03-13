import {
    range,
    keys,
    obj_diff_keys,
    is_callable,
    array_unique_merge,
} from "../src/utils.js";

test('range', () => {
    expect(range(0, 5)).toStrictEqual([0,1,2,3,4]);
    expect(range(2, 3, 3)).toStrictEqual([2, 5, 8]);
});

test('empty range', () => {
    expect(range(0, 0)).toStrictEqual([]);
    expect(range(5, 0, 2)).toStrictEqual([]);
});

test('keys', () => {
    expect(keys({a: 1, b: 2})).toEqual(['a', 'b']);
    expect(keys([1, 2, 3])).toEqual(["0", "1", "2"]);
    expect(keys("hello")).toEqual([]);
});

test('obj_diff_keys', () => {
    const a = {a: 123, b: "hello", c: null};
    const b = {d: "bingo", b: 123, a: 123};
    expect(obj_diff_keys(a, b)).toEqual(['d', 'b', 'c']);
    expect(obj_diff_keys(a, a)).toEqual([]);
});

test('is_callable', () => {
    expect(is_callable(() => true)).toBeTruthy();
    expect(is_callable(function hello() { return 'world'} )).toBeTruthy();

    class Hello { };
    expect(is_callable(Hello)).toBeTruthy();
    expect(is_callable(class { })).toBeTruthy();

    expect(is_callable("func")).toBeFalsy();
    expect(is_callable(null)).toBeFalsy();
});
