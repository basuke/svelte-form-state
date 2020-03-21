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
            {file: pkg.main, 'format': 'cjs'},
            {file: pkg.module, 'format': 'es' },
        ],
        plugins: [
            commonjs(),
            resolve(),
        ],
    },
    {
        input: [
            "src/widgets/index.js",
        ],
        external,
        output: [
            {file: "dist/widgets/index.cjs.js", 'format': 'cjs'},
            {file: "dist/widgets/index.esm.js", 'format': 'es' },
        ],
        plugins: [
            svelte(),
            resolve(),
        ],
    },
];
