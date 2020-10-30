<script>
  import { onMount } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { Utils } from "../../utils.js";
  import Modal from "../../components/common/Modal.svelte";
  import SellProductModal from "../../components/modals/SellProduct-Modal.svelte";
  import IssueBuyModal from "../../components/modals/IssueBuy-Modal.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { MerchantService } from "../../services/merchant-service.js";
  import { fade } from "svelte/transition";
  import { selected_product, current_user } from "../../store.js";
  let addModal,
    deleteModal,
    buyModal,
    itemToDelete,
    items = [],
    isLoading = true,
    hasLoadingError = false,
    skip = 0;
  const take = 6;
  async function openIssueBuyModal(item) {
    buyModal.open({
      title: `Buy '${item.title}'`,
      product: item
    });
  }
  async function openDeleteModal(item) {
    itemToDelete = item;
    deleteModal.open({
      title: `Delete '${itemToDelete.title}'`
    });
  }
  async function dismissDeleteModal() {
    deleteModal.close();
  }
  function selectItem(item) {
    selected_product.set(
      $selected_product && $selected_product.id === item.id ? null : item
    );
  }
  async function deleteItem() {
    deleteModal.toggleLoading();
    await MerchantService.deleteProduct(itemToDelete.id);
    deleteModal.toggleLoading();
    dismissDeleteModal();
    loadItems();
  }
  async function openAddModal() {
    addModal.open({ title: `Add new item` });
  }
  async function addModalSubmit(newItem) {
    loadItems();
  }
  async function issueBuyModalSubmit() {
    loadItems();
  }
  async function getItemImage(item) {
    return await FirebaseAPI.downloadFile("sellerProducts", item.id);
  }
  async function loadMore() {
    if (canLoadMore) {
      skip += take;
      displayItems = displayItems.concat(items.slice(skip, skip + take));
      displayingAll = items.length === displayItems.length;
    }
  }
  async function loadItems() {
    isLoading = true;
    hasLoadingError = false;
    try {
      items = await MarketService.get();
    } catch (error) {
      items = [];
      hasLoadingError = true;
    }
    isLoading = false;
  }
  onMount(async () => {
    loadItems();
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
  .item-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .item-column {
    display: flex;
    flex-direction: column;
    width: 25%;
    justify-content: center;
    text-align: center;
    margin: 0 10px;
  }
  .item-column-header {
    font-size: 12px;
  }
  .item-action {
    min-width: 6vw;
  }
  .item.selected {
    background-color: rgba(173, 216, 230, 0.4);
    transition: background-color 200ms;
    cursor: pointer;
  }
  .item:hover:not(.selected) {
    background-color: rgba(173, 216, 230, 0.2);
    transition: background-color 200ms;
    cursor: pointer;
  }
  .no-items {
    display: flex;
    flex-direction: column;
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
  .loading-error button {
    margin-top: 10px;
    font-size: 1rem;
  }
</style>

<div class="container">
  {#if !isLoading && !hasLoadingError && items}
    <div transition:fade|local class="actions">
      <button on:click={openAddModal}>Add Item</button>
    </div>
  {/if}
  <div class="items">
    {#if items && items.length > 0}
      {#each items as item}
        <div
          on:click={selectItem(item)}
          transition:fade|local
          class="item no-scroll"
          class:selected={$selected_product && $selected_product.id === item.id}>
          <div class="item-content">
            <div class="item-column">
              <span>{item.title}</span>
            </div>
            <div class="item-column">
              <span class="item-column-header">Vanzator</span>
              <span>PlaceHolder Nume</span>
            </div>
            <div class="item-column">
              <span class="item-column-header">Suma datorata</span>
              <span>{item.bookValueAmount} RON</span>
            </div>
            <div class="item-column">
              <span class="item-column-header">Pret</span>
              <span>{item.priceAmount} RON</span>
            </div>
          </div>

          {#if $current_user && $current_user.id === item.merchantId}
            <button class="item-action" on:click={openDeleteModal(item)}>
              Remove
            </button>
          {:else}
            <button class="item-action" on:click={openIssueBuyModal(item)}>
              Buy
            </button>
          {/if}
        </div>
      {/each}
    {:else if isLoading}
      <LoadingSpinner {isLoading} />
    {:else if hasLoadingError}
      <div in:fade|local class="no-items no-scroll loading-error">
        <span>A aparut o eroare</span>
        <button on:click={loadItems}>Try Again</button>
      </div>
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
<IssueBuyModal
  bind:this={buyModal}
  on:submit={event => issueBuyModalSubmit()} />
<!-- delete modal -->
<Modal bind:this={deleteModal}>
  <div slot="content">
    Are you sure you wish to delete '{itemToDelete.title}'?
  </div>
  <div slot="actions">
    <button on:click={deleteItem}>Yes</button>
    <button on:click={dismissDeleteModal}>No</button>
  </div>
</Modal>
