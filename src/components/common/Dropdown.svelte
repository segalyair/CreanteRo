<script>
  import { slide } from "svelte/transition";
  export let items = [];
  export let selected = null;
  export let open = false;
  let dropdown;
  async function toggle() {
    open = !open;
  }
  async function close() {
    open = false;
  }
  async function itemClicked(event, item) {
    selected = item.value;
    event.stopPropagation();
    close();
  }
</script>

<style>
  .container {
    position: relative;
  }
  .container button {
    min-width: 200px;
  }
  .items-container {
    position: absolute;
    display: flex;
    flex-direction: column;
  }
  .dropdown-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 200px;
    height: 30px;
    background-color: rgb(235, 235, 235);
    border-bottom: 1px solid grey;
    border-left: 1px solid grey;
    border-right: 1px solid grey;
    cursor: pointer;
    z-index: 20;
  }
  .dropdown-item:first-child {
    border-top: 1px solid grey;
    border-top-right-radius: 2px;
  }
  .dropdown-item:last-child {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .dropdown-item:hover {
    background-color: rgb(243, 243, 243);
    transition: background-color 200ms linear;
  }
  .dropdown-item span {
    margin-left: 10px;
    user-select: none;
  }
</style>

<div class="container">
  <button bind:this={dropdown} on:click={toggle}>
    {selected ? selected : 'Choose an option'}
  </button>
  {#if open}
    <div class="items-container">
      <div transition:slide>
        {#each items as item}
          <div
            on:click={event => itemClicked(event, item)}
            class="dropdown-item">
            <span>{item.value}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
