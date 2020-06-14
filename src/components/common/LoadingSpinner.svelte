<script>
  import Spinner from "svelte-spinner";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  export let isLoading = false;
  export let backgroundColor = "transparent";
  let container;
  onMount(() => {
    container.style.backgroundColor = backgroundColor;
  });
</script>

<style>
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

{#if isLoading}
  <div bind:this={container} transition:fade|local class="loading">
    <Spinner size="250" speed="650" color="#1b6dc1" thickness="1.5" gap="40" />
  </div>
{/if}
