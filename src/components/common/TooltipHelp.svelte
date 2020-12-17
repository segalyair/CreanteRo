<script>
  import { fade } from "svelte/transition";
  export let message = null;
  let showHelp = false;
  function toggleHelp(value) {
    showHelp = value;
  }
</script>

<style>
  .container {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    margin: auto auto auto 0;
    background-color: #1b6dc1;
    border-radius: 12px;
    cursor: help;
  }
  .container:hover {
    background-color: #1b6ec1c0;
  }
  .question-mark {
    color: white;
    font-weight: bold;
    font-size: 0.7em;
    user-select: none;
  }
  .message-container {
    position: absolute;
    z-index: 10;
    width: 250px;
    top: 0;
    left: 40px;
    padding: 14px;
    border: 1px solid lightgray;
    border-radius: 4px;
    background-color: white;
  }
</style>

<div
  class="container"
  on:mouseover={() => toggleHelp(true)}
  on:mouseleave={() => toggleHelp(false)}>
  <span class="question-mark">?</span>
  {#if showHelp}
    <div transition:fade={{ duration: 200 }} class="message-container">
      {@html message || 'No message given'}
    </div>
  {/if}
</div>
