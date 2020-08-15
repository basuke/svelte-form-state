import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import pkg  from './package.json';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const external = [
    'svelte',
    'svelte/store',
];

const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "src/index.js",
        external,
        output: [
            {file: pkg.main, 'format': 'cjs', sourcemap: true, exports: 'named'},
            {file: pkg.module, 'format': 'es', sourcemap: true},
        ],
        plugins: [
            svelte({
                // enable run-time checks when not in production
                dev: !production,
                preprocess: sveltePreprocess(),
            }),
            resolve(),
            commonjs(),
            typescript({ sourceMap: !production }),
        ],
    },
];
