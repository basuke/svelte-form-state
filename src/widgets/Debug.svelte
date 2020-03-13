<script>

import {getContext} from 'svelte';

export let form = undefined;
export let state = undefined;
let visible = false;
const hasSlot = $$props.$$slots;

if (!form) form = getContext('form');
if (!state) state = getContext('state');

$: isValid = $form.valid === undefined ? "-" : $form.valid ? "OK" : "NG";

const columnCount = 7;

</script>

{#if visible}
<table>
    <tr>
        <td class="      col1"><span class=link on:click={() => visible = false}>▼</span></td>
        <th class="value col2">value</th>
        <th class="value col3">filtered</th>
        <th class="value col4">focus</th>
        <th class="value col5">dirty</th>
        <th class="value col6">pending</th>
        <th class="value col7">errors</th>
    </tr>
    {#each Object.keys($form) as key (key)}
        <tr>
            <th>{key}</th>
            <td>{$form[key]}</td>
            <td class={$form[key] == $state.values[key] ? 'no-change' : ''}>{$state.values[key]}</td>
            <td><input type=checkbox disabled checked={$state.focus == key}></td>
            <td><input type=checkbox disabled checked={$state.dirty.has(key)}></td>
            <td><input type=checkbox disabled checked={$state.pendingKeys.has(key)}></td>
            <td class="error-message">{$state.errors[key] ? $state.errors[key].join(", ") : ""}</td>
        </tr>

    {:else}
        <tr><td colspan={columnCount}>&lt;no data&gt;</td></tr>
    {/each}
    {#if hasSlot}
        <tr>
            <th><slot name="title">extra info</slot></th>
            <td colspan={columnCount - 1}><slot/></td>
        </tr>
    {/if}
    <tr>
        <td>is valid? {isValid} </td>
        <td class="button-column" colspan={columnCount - 1}>
            <button on:click={form.validate}>Validate</button>
        </td>
    </tr>
</table>
{:else}
<span class=link on:click={() => visible = true}>▶ show inside <b>form</b> and <b>state</b></span>
{/if}

<style>

td, th {
    padding: 1px 3px;
}

th {
    background-color: gainsboro;
    text-align: right;
}

th.value {
    text-align: left;
}

td {
    text-align: left;
}

.no-change {
    color: gainsboro;
}

.error-message {
    color: crimson;
}

button {
    font-weight: bolder;
    min-width: 80%;
    padding: 2px 2em;
}

.button-column {
    text-align: center;
}

.link {
    cursor: pointer;
}
</style>