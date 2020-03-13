<script>

import {getContext} from 'svelte';

export let form = undefined;
export let name = undefined;
export let disabled = false;

if (!form) form = getContext('form');

let rest = {...$$props};
delete rest.form;
delete rest.name;
delete rest.disabled;

</script>

<input bind:value={$form[name]} on:focus={form.focus[name]} on:blur={form.blur} {disabled} {...rest}>
