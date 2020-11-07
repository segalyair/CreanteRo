<script>
  import { onMount } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { Utils } from "../../utils.js";
  import Modal from "../../components/common/Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import SellProductModal from "../../components/modals/SellProduct-Modal.svelte";
  import VerifyUserModal from "../../components/modals/VerifyUser-Modal.svelte";
  import IssueBuyModal from "../../components/modals/IssueBuy-Modal.svelte";
  import ImgModal from "../../components/modals/Img-Modal.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { MerchantService } from "../../services/merchant-service.js";
  import { fade, slide } from "svelte/transition";
  import { selected_product, current_user } from "../../store.js";
  import { _ } from "../../i18n";
  let addModal,
    deleteModal,
    verifyUserModal,
    imgModal,
    buyModal,
    toast,
    itemToDelete,
    items = [],
    isLoading = true,
    hasLoadingError = false,
    skip = 0;
  const take = 6;
  function openImgModal() {
    imgModal.open({ title: "" });
  }
  function openVerifyUserModal(item) {
    verifyUserModal.open({
      title: $_("verifyAccount.verifyAccount")
    });
  }
  function openIssueBuyModal(item) {
    if (!$current_user.isEmailVerified) {
      openVerifyUserModal();
    } else {
      buyModal.open({
        title: `${$_("list.buy")} '${item.title}'`,
        product: item
      });
    }
  }
  function openDeleteModal(item) {
    if (!$current_user.isEmailVerified) {
      openVerifyUserModal();
    } else {
      itemToDelete = item;
      deleteModal.open({
        title: `${$_("list.remove")} '${itemToDelete.title}'`
      });
    }
  }
  async function dismissDeleteModal() {
    deleteModal.close();
  }
  function downloadPDF() {}
  function selectItem(item) {
    if ($selected_product && $selected_product.id === item.id) return;
    selected_product.set(item);
  }
  async function deleteItem() {
    deleteModal.toggleLoading();
    try {
      await MerchantService.deleteProduct(itemToDelete.id);
      toast.create($_("list.itemDeleted"), 3000);
      loadItems();
    } catch (error) {
      toast.create($_("list.itemFailDelete"), 3000, "#e46464");
    }
    deleteModal.toggleLoading();
    dismissDeleteModal();
  }
  async function openAddModal() {
    if (!$current_user.isEmailVerified) {
      openVerifyUserModal();
    } else {
      addModal.open({ title: `sellProduct.addNewItem` });
    }
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
    flex: 2 1 0px;
    height: 95vh;
    overflow: auto;
    padding: 50px 50px 50px 50px;
    min-width: 60vw;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 12px;
    background-color: white;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
  }
  .actions {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .items {
    position: relative;
    height: 100%;
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .no-scroll {
    overflow: hidden;
  }
  .item {
    flex-shrink: 0;
    width: 60vw;
    border: 1px solid lightgray;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 20px;
    cursor: pointer;
    user-select: none;
  }
  .item-secondary-content {
    margin-top: 15px;
  }
  .item-secondary-content img {
    object-fit: cover;
    width: 100px;
    height: 100px;
    border: 1px solid lightgray;
    border-radius: 4px;
    cursor: pointer;
    margin: 2px;
  }
  .pdfs {
    display: flex;
    flex-wrap: wrap;
  }
  .thumbnails {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 15px;
  }
  .item-main-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
    cursor: auto;
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
      <button class="primary" on:click={openAddModal}>
        {$_('list.addItem')}
      </button>
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
          <div class="item-main-content">
            <div class="item-content">
              <div class="item-column">
                <span>{item.title}</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Suma datorata</span>
                <span>{item.bookValueAmount} RON</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Pret</span>
                <span>{item.priceAmount} RON</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Profit</span>
                <span>{item.bookValueAmount - item.priceAmount} RON</span>
              </div>
            </div>
            {#if $current_user && $current_user.id === item.merchantId}
              <button
                class="item-action"
                on:click={openDeleteModal(item)}
                type="button">
                {$_('list.remove')}
              </button>
            {:else}
              <button
                class="primary item-action"
                on:click={openIssueBuyModal(item)}
                type="button">
                {$_('list.buy')}
              </button>
            {/if}
          </div>
          {#if $selected_product && item && $selected_product.id === item.id}
            <div class="item-secondary-content" transition:slide>
              <div class="thumbnails">
                {#each [1, 2, 3] as pdf}
                  <img
                    on:click={downloadPDF}
                    src="PDF_file_icon.png"
                    alt="pdf" />
                {/each}
                {#each [1, 2, 3, 4, 5, 6] as img}
                  <img
                    on:click={openImgModal}
                    src="logo200.png"
                    alt="thumbnail" />
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {:else if isLoading}
      <LoadingSpinner {isLoading} />
    {:else if hasLoadingError}
      <div in:fade|local class="no-items no-scroll loading-error">
        <span>A aparut o eroare</span>
        <button class="primary" on:click={loadItems} type="button">
          {$_('list.tryAgain')}
        </button>
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
<VerifyUserModal
  bind:this={verifyUserModal}
  on:submit={event => verifyUserModalSubmit()} />
<ImgModal bind:this={imgModal} />
<!-- delete modal -->
<Modal bind:this={deleteModal}>
  <div slot="content">
    {$_('list.areYouSureYouWishToDelete')} '{itemToDelete.title}'?
  </div>
  <div slot="actions">
    <button class="primary" on:click={deleteItem} type="button">
      {$_('list.yes')}
    </button>
    <button on:click={dismissDeleteModal} type="button">{$_('list.no')}</button>
  </div>
</Modal>
<Toast bind:this={toast} />
