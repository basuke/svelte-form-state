import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import pkg  from './package.json';

export default {
    input: "src/index.js",
    output: [
        {file: pkg.main, 'format': 'cjs'},
        {file: pkg.module, 'format': 'es' },
    ],
    plugins: [
        svelte(),
        resolve(),
    ],
};
