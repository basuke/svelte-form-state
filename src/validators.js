// validators

export function requiredIf(condition) {
    return ({value}) => !condition() || value ? "" : "必ず入力してください";
}

export const required = requiredIf(() => true);

export function matchPattern(pattern, error) {
    return ({value, errors}) => errors.length > 0 || value.match(pattern) ? "" : error;
}

export const isDigit = matchPattern(/^[0-9]*$/, "数字を入力してください");

