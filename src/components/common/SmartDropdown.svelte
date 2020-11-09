<script>
  import { Trash2Icon, Edit2Icon, PlusCircleIcon } from "svelte-feather-icons";
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let items = [];
  $: {
    selected = null;
    dispatch("select", null);
    filteredItems =
      !search || !search.value || search.value.length === 0
        ? items
        : items.filter(i =>
            i.label.toLowerCase().includes(search.value.toLowerCase())
          );
  }
  let search,
    filteredItems = [],
    selected;
  function select(item) {
    selected = item;
    dispatch("select", item);
  }
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  onMount(() => {
    filteredItems = items;
    search.addEventListener(
      "input",
      debounce(() => {
        filteredItems =
          !search || !search.value || search.value.length === 0
            ? items
            : items.filter(i =>
                i.label.toLowerCase().includes(search.value.toLowerCase())
              );
      }, 150)
    );
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  .search {
    flex-grow: 1;
    margin: 0;
  }
  .debtor-container {
    height: 250px;
    overflow-y: auto;
    background-color: #f4f4f4;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgray;
    background-color: white;
    padding: 10px 5px 10px 5px;
    cursor: pointer;
    user-select: none;
  }
  .item:not(.selected):hover {
    background-color: rgb(232, 240, 254);
  }
  .item.selected {
    background-color: #1b6dc1;
    color: white;
  }
  .actions {
    display: flex;
  }
  .header {
    display: flex;
  }
  .header button {
    background-color: #1b6dc1;
    color: white;
    min-width: 0;
    margin-right: 10px;
  }
  .icon-container {
    cursor: pointer;
    margin: 0 3px;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>

<div class="container">
  <div class="header">
    <input
      class="search"
      bind:this={search}
      type="text"
      placeholder="Caută..." />
    <button type="button" on:click={() => dispatch('add')}>
      <div class="icon-container">
        <PlusCircleIcon size="22" />
      </div>
    </button>
  </div>

  <div class="debtor-container">
    {#each filteredItems as item}
      <div
        class="item"
        class:selected={selected && item.id === selected.id}
        on:click={() => select(item)}>
        <span>{item.label}</span>
        <div class="actions">
          <div class="icon-container" on:click={() => dispatch('edit', item)}>
            <Edit2Icon size="22" />
          </div>
          <div class="icon-container" on:click={() => dispatch('delete', item)}>
            <Trash2Icon size="22" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
