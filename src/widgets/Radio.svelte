<script>

import {getContext} from 'svelte';

export let form = undefined;
export let name = undefined;
export let value = undefined;
export let disabled = false;

if (!form) form = getContext('form');

</script>

<input type=radio bind:group={$form[name]} value={value} on:focus={form.focus[name]} on:blur={form.blur} {disabled}>
