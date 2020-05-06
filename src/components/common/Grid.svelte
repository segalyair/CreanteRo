<script>
  import { onMount } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { Utils } from "../../utils.js";
  import Modal from "../../components/common/Modal.svelte";
  import SellProductModal from "../../components/modals/SellProduct-Modal.svelte";
  let addModal,
    deleteModal,
    itemToDelete,
    allItems = [],
    displayItems = null,
    displayingAll = false,
    skip = 0;
  const take = 6;
  $: canLoadMore = allItems && allItems.length - skip - take > 0;
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
    await FirebaseAPI.delete("items", {
      id: itemToDelete.id
    });
    if (itemToDelete.image) {
      await FirebaseAPI.deleteFile("items", itemToDelete.id);
    }
    deleteModal.toggleLoading();
    dismissDeleteModal();
    //Make sure item was deleted
    const deletedItem = await FirebaseAPI.findById("items", itemToDelete.id);
    if (deletedItem === null) {
      allItems = allItems.filter(i => i.id !== itemToDelete.id);
      displayItems = displayingAll
        ? displayItems.filter(i => i.id !== itemToDelete.id)
        : allItems.slice(skip, skip + take);
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
    allItems = await FirebaseAPI.get("items", {
      orderBy: "creationDate"
    });
    if (allItems) {
      displayItems = allItems.slice(0, take);
    }
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 83vh;
  }
  .actions {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .items {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }
  .item {
    border: 1px solid lightgray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
  }
  .item img {
    width: 100px;
    height: 100px;
  }
  .load-more-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .load-more {
    width: 100px;
    align-self: flex-end;
    margin-top: 10px;
  }
</style>

<div class="actions">
  <button on:click={openAddModal}>Add Item</button>
</div>
<div class="container">
  <div class="items">
    {#if displayItems && displayItems.length > 0}
      {#each displayItems as item}
        <div class="item">
          {#if item.image}
            {#await getItemImage(item)}
              <img src="empty.png" alt="Loading..." />
            {:then src}
              <img {src} alt="Item image" />
            {:catch error}
              <p style="color: red">{error.message}</p>
            {/await}
          {:else}
            <img src="no-image.png" alt="No image" />
          {/if}
          {item.value}
          <button on:click={openDeleteModal(item)}>Remove item</button>
        </div>
      {/each}
    {/if}
    {#if displayItems === null}Loading...{/if}
    {#if displayItems && displayItems.length === 0}No items.{/if}
    {#if canLoadMore && !displayingAll}
      <div class="load-more-container">
        <button class="load-more" on:click={loadMore}>Load more</button>
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
