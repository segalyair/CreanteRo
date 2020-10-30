<script>
  export let message = null;
  let showHelp = false;
  function toggleHelp(value) {
    showHelp = value;
  }
</script>

<style>
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23px;
    height: 23px;
    margin: auto auto auto 10px;
    background-color: #1b6dc1;
    border-radius: 23px;
    cursor: pointer;
  }
  .container:hover {
    background-color: #1b6ec1c0;
  }
  .question-mark {
    color: white;
    font-weight: bold;
    user-select: none;
  }
  .message-container {
    position: absolute;
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
    <div class="message-container">{message || 'No message given'}</div>
  {/if}
</div>
