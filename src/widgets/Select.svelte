<script>

import {getContext} from 'svelte';

export let form = undefined;
export let name = undefined;
export let placeholder = undefined;
export let disabled = false;

if (!form) form = getContext('form');

</script>

<select bind:value={$form[name]} on:focus={form.focus[name]} on:blur={form.blur} {disabled}>
    {#if placeholder}
        <option value="">{placeholder}</option>
    {/if}
    <slot />
</select>