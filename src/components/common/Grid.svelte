<script>
  import { onMount } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { Utils } from "../../utils.js";
  import Modal from "../../components/common/Modal.svelte";
  import SellProductModal from "../../components/modals/SellProduct-Modal.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { MerchantService } from "../../services/merchant-service.js";
  import { fade } from "svelte/transition";
  let addModal,
    deleteModal,
    itemToDelete,
    items = [],
    isLoading = true,
    skip = 0;
  const take = 6;
  async function openDeleteModal(item) {
    itemToDelete = item;
    deleteModal.open({
      title: `Delete '${itemToDelete.value}'`
    });
  }
  async function dismissDeleteModal() {
    deleteModal.close();
  }
  async function deleteItem() {
    deleteModal.toggleLoading();

    // await FirebaseAPI.delete("items", {
    //   id: itemToDelete.id
    // });
    // if (itemToDelete.image) {
    //   await FirebaseAPI.deleteFile("items", itemToDelete.id);
    // }
    await MerchantService.deleteProduct(itemToDelete.id);
    deleteModal.toggleLoading();
    dismissDeleteModal();
    //Make sure item was deleted
    const deletedItem = await FirebaseAPI.findById("items", itemToDelete.id);
    if (deletedItem === null) {
      items = items.filter(i => i.id !== itemToDelete.id);
    }
    itemToDelete = null;
  }
  async function openAddModal() {
    addModal.open({ title: `Add new item` });
  }
  async function addModalSubmit(newItem) {
    if (newItem) {
      allItems = allItems ? [newItem, ...allItems] : [newItem];
      if (displayItems && displayItems.length % take === 0 && !displayingAll) {
        displayItems.pop();
      }
      displayItems = [newItem, ...displayItems];
    }
  }
  async function getItemImage(item) {
    return await FirebaseAPI.downloadFile("sellerProducts", item.id);
  }
  async function loadMore() {
    if (canLoadMore) {
      skip += take;
      displayItems = displayItems.concat(allItems.slice(skip, skip + take));
      displayingAll = allItems.length === displayItems.length;
    }
  }
  onMount(async () => {
    const data = await MarketService.get();
    console.log(data);
    // allItems = await FirebaseAPI.get("items", {
    //   orderBy: "creationDate"
    // });
    // if (allItems) {
    //   displayItems = allItems.slice(0, take);
    // }
    items = data;
    isLoading = false;
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 0px;
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
  .actions {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .items {
    position: relative;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }
  .no-scroll {
    overflow: hidden;
  }
  .item {
    border: 1px solid lightgray;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    height: 75px;
    padding: 6px;
    cursor: pointer;
  }
  .item:hover {
    background-color: #ffe17f75;
    transition: background-color 200ms;
  }
  .no-items {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2vw;
    width: 100%;
    height: 100%;
    font-weight: 300;
  }
  .no-items span {
    width: 50%;
    text-align: center;
  }
</style>

<div class="container">
  {#if !isLoading && items}
    <div transition:fade|local class="actions">
      <button on:click={openAddModal}>Add Item</button>
    </div>
  {/if}
  <div class="items">
    {#if items && items.length > 0}
      {#each items as item}
        <div transition:fade|local class="item no-scroll">
          {item.value}
          <button on:click={openDeleteModal(item)}>Remove item</button>
        </div>
      {/each}
    {:else if isLoading}
      <LoadingSpinner {isLoading} />
    {:else if !isLoading && (!items || items.length === 0)}
      <div transition:fade|local class="no-items no-scroll">
        <span>In acest moment nu exista o creanta listata</span>
      </div>
    {/if}
  </div>
</div>
<!-- add modal -->
<SellProductModal
  bind:this={addModal}
  on:submit={event => addModalSubmit(event.detail)} />
<!-- delete modal -->
<Modal bind:this={deleteModal}>
  <div slot="content">
    Are you sure you wish to delete '{itemToDelete.value}'?
  </div>
  <div slot="actions">
    <button on:click={deleteItem}>Yes</button>
    <button on:click={dismissDeleteModal}>No</button>
  </div>
</Modal>
