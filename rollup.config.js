import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
const pkg = require('./package.json');

export default {
    input: "src/index.js",
    external: ['ms'],
    output: [
        {file: pkg.main, 'format': 'cjs'},
        {file: pkg.module, 'format': 'es' },
    ],
    plugins: [
        svelte(),
        resolve(),
    ],
};
