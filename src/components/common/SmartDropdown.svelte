<script>
  import { Trash2Icon, Edit2Icon, PlusCircleIcon } from "svelte-feather-icons";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { _ } from "../../i18n";
  const dispatch = createEventDispatcher();
  export let items = [],
    label = "defaultLabel",
    required = false;
  let dirty = false;
  $: {
    filteredItems =
      !search || !search.value || search.value.length === 0
        ? items
        : items.filter(i =>
            i.label.toLowerCase().includes(search.value.toLowerCase())
          );
  }
  let search,
    open = false,
    filteredItems = [],
    selected;
  function select(e, item) {
    e.preventDefault();
    e.stopPropagation();
    selected = item;
    dispatch("select", selected);
    search.value = item.label;
    open = false;
  }
  function edit(e, item) {
    e.preventDefault();
    e.stopPropagation();
    dispatch("edit", item);
  }
  function remove(e, item) {
    e.preventDefault();
    e.stopPropagation();
    dispatch("delete", item);
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
  function mouseClick(e) {
    if (e.target === search) return;
    if (open) {
      dirty = true;
      selected = null;
      dispatch("select", selected);
      open = false;
    }
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
    search.addEventListener("focus", () => {
      open = true;
      search.value = "";
    });
    document.addEventListener("click", mouseClick);
  });
  onDestroy(() => {
    document.removeEventListener("click", mouseClick);
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 300px;
    position: relative;
  }
  input {
    flex-grow: 1;
    margin: 0;
  }
  input.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
  .error {
    color: red;
    font-size: 0.8em;
  }
  .debtor-container {
    height: 250px;
    overflow-y: auto;
    width: inherit;
    position: absolute;
    top: 40px;
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
    height: 40px;
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
      class={dirty ? $$props.class : ''}
      bind:this={search}
      type="text"
      placeholder="Caută..." />
    <button type="button" on:click={() => dispatch('add')}>
      <div class="icon-container">
        <PlusCircleIcon size="22" />
      </div>
    </button>
  </div>
  {#if !selected && dirty && required}
    <div transition:slide>
      <p class="error">{$_(`${label}.error.isRequired`)}</p>
    </div>
  {/if}
  {#if open}
    <div class="debtor-container">
      {#each filteredItems as item}
        <div
          class="item"
          class:selected={selected && item.id === selected.id}
          on:click={e => select(e, item)}>
          <span>{item.label}</span>
          <div class="actions">
            <div class="icon-container" on:click={e => edit(e, item)}>
              <Edit2Icon size="22" />
            </div>
            <div class="icon-container" on:click={e => remove(e, item)}>
              <Trash2Icon size="22" />
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
