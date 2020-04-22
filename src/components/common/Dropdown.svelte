<script>
  import DropdownBase from "./base/DropdownBase.svelte";
  export let items = [];
</script>

<style>
  .dropdown-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 200px;
    height: 30px;
    background-color: rgb(224, 224, 224);
    border-bottom: 1px solid grey;
    border-left: 1px solid grey;
    border-right: 1px solid grey;
    cursor: pointer;
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
    background-color: rgb(238, 238, 238);
    transition: background-color 200ms linear;
  }
  .dropdown-item span {
    margin-left: 10px;
    user-select: none;
  }
</style>

<DropdownBase>
  <div slot="items">
    {#each items as item}
      <div class="dropdown-item">
        <span>{item.value}</span>
      </div>
    {/each}
  </div>
</DropdownBase>
