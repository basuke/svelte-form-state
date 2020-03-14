export function range(start, count, step = 1) {
    if (!count) return [];
    return [...(new Array(count)).keys()].map((_, index) => start + index * step);
}

export function keys(obj) {
    if (typeof obj !== 'object') return [];
    return Object.keys(obj);
}

export function obj_diff_keys(a, b) {
    return array_unique_merge(keys(a), keys(b))
        .filter(key => a[key] !== b[key]);
}

export function is_callable(fn) {
    return (typeof fn === 'function');
}

export function array_pluck(a, key) {
    return a.map(item => item[key]);
}

export function array_zip(...arrays) {
    if (!arrays.length) return [];
    const len = Math.min(...array_pluck(arrays, 'length'));
    return range(0, len).map(index => array_pluck(arrays, index));
}

export function array_zip_longest(...arrays) {
    if (!arrays.length) return [];
    const len = Math.max(...array_pluck(arrays, 'length'));
    return range(0, len).map(index => array_pluck(arrays, index));
}

export function array_unique(a) {
    return a.filter((item, index, self) => self.indexOf(item) === index);
}

export function array_unique_merge(...arrays) {
    return array_zip_longest(...arrays).reduce((result, values) => {
        for (const x of values) {
            if (x && !result.includes(x)) result.push(x);
        }
        return result;
    }, []);
}

export function del_keys(obj, ...keys) {
    for (const key of keys)
        delete obj[key];
    return obj;

}
