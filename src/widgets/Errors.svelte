<script>

import {getContext} from 'svelte';
import {array_unique_merge} from '../utils';

export let state = undefined;
export let name = undefined;
export let names = undefined;

if (!state) state = getContext('state');

$: errors = (() => {
    if (!state) return null;

    const errors = $state.errors;

    if (Array.isArray(names)) {
        return array_unique_merge(...names.map(aKey => errors[aKey]).filter(_ => _));
    } else if (name) {
        return errors[name];
    } else {
        return [];
    }
})();

$: hasError = (() => {
    return errors && errors.length > 0;
})();

</script>

{#if hasError}
    {#each errors as error}
        <div class=error>{error}</div>
    {/each}
{/if}
