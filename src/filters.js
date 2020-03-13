// filters

import jaconv from 'jaconv';

export const trim = ({value}) => value.trim();
export const asciiZenToHan = ({value}) => jaconv.toHanAscii(value);
