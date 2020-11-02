<script>
  import { onMount, createEventDispatcher } from "svelte";
  export let id, group, buttons;
</script>

<style>
  .radio-buttons {
    padding: 10px 0;
  }
  label {
    display: inline-block;
    margin-right: 10px;
  }
  input {
    cursor: pointer;
  }
</style>

<div {id} class="radio-buttons">
  {#each buttons as button}
    <input
      type="radio"
      name={button.for}
      bind:group
      value={button.value} />
    <label for={button.for}>{button.label}</label>
  {/each}
</div>
