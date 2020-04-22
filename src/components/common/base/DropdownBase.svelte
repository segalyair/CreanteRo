<script>
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  let open = false;
  let dropdown;
  onMount(() => {
    dropdown.onblur = () => {
      open = false;
    };
  });
</script>

<style>
  .container {
    position: relative;
  }
  .items-container {
    position: absolute;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="container">
  <button bind:this={dropdown} on:click={() => (open = !open)}>
    Open Dropdown
  </button>
  {#if open}
    <div class="items-container">
      <div transition:slide>
        <slot name="items" />
      </div>
    </div>
  {/if}
</div>
