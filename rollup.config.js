import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import pkg  from './package.json';

const external = [
    'svelte',
    'svelte/store',
];

export default [
    {
        input: "src/index.js",
        external,
        output: [
            {file: pkg.main, 'format': 'cjs', exports: 'named'},
            {file: pkg.module, 'format': 'es'},
        ],
        plugins: [
            svelte(),
            resolve(),
            commonjs(),
        ],
    },
];
