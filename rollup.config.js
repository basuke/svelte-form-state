import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import pkg  from './package.json';

export default {
    input: "src/index.js",
    external: [
        'svelte',
        'svelte/store',
    ],
    output: [
        {file: pkg.main, 'format': 'cjs'},
        {file: pkg.module, 'format': 'es' },
    ],
    plugins: [
        svelte(),
        commonjs(),
        resolve(),
    ],
};
