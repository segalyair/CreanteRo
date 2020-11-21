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
    imgIndex = 0,
    buyModal,
    toast,
    itemToDelete,
    items = [],
    isLoading = true,
    hasLoadingError = false,
    skip = 0;
  const take = 6;
  async function setObjectUrl(thumbnails) {
    if (!thumbnails[imgIndex].objectUrl) {
      let img = await MarketService.getProductFile(
        $selected_product.product.id,
        thumbnails[imgIndex].name
      );
      if (img && img.ok === false) {
        throw Error("img not ok");
      }
      thumbnails[imgIndex].objectUrl = URL.createObjectURL(await img.blob());
    }
  }
  async function changeImg(i) {
    const newImgIndex = imgIndex + i;
    const thumbnails = $selected_product.thumbnails;
    if (newImgIndex >= 0 && newImgIndex < thumbnails.length) {
      imgIndex = newImgIndex;
      await setObjectUrl(thumbnails);
      imgModal.changeSettings({
        title: "",
        src: thumbnails[imgIndex].objectUrl,
        current: imgIndex,
        length: thumbnails.length
      });
    }
  }
  async function openImgModal(id, photo, index) {
    try {
      imgIndex = index;
      const thumbnails = $selected_product.thumbnails;
      await setObjectUrl(thumbnails);
      imgModal.open({
        title: "",
        src: thumbnails[index].objectUrl,
        current: imgIndex,
        length: thumbnails.length
      });
    } catch (err) {
      toast.create($_("list.itemImageFailOpen"), 3000, "#e46464");
      imgModal.open({ title: "" });
      console.log(err);
    }
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
  async function downloadPDF(id, pdf) {
    try {
      let pdfResult = await MarketService.getProductFile(id, pdf);
      if (pdfResult && pdfResult.ok === false) {
        throw Error("pdf not ok");
      }
      await Utils.download(pdfResult, pdf);
    } catch (err) {
      toast.create($_("list.pdfFailDownload"), 3000, "#e46464");
      console.log(err);
    }
  }
  async function downloadZIP(id) {
    try {
      let otherResult = await MarketService.getProductFile(id, "other.zip");
      if (otherResult && otherResult.ok === false) {
        throw Error("pdf not ok");
      }
      await Utils.download(otherResult, "other.zip");
    } catch (err) {
      toast.create($_("list.pdfFailDownload"), 3000, "#e46464");
      console.log(err);
    }
  }
  function selectItem(item) {
    if ($selected_product && $selected_product.product.id === item.id) return;
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
      addModal.open({ title: $_(`sellProduct.addNewItem`) });
    }
  }
  async function addModalSubmit(newItem) {
    loadItems();
  }
  async function issueBuyModalSubmit() {
    loadItems();
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
    display: flex;
    width: 100%;
    background-color: white;
    border-radius: 6px;
    border: 1px solid lightgray;
    padding: 10px;
  }
  .url {
    cursor: pointer;
    color: #1b6dc1;
    flex-shrink: 0;
    margin: 2px 5px;
    width: fit-content;
  }
  .url:hover {
    text-decoration: underline;
    color: #1b6ec1a9;
  }
  .docs-span {
    margin-top: 2px;
    margin-right: 10px;
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
  .item-secondary-column {
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    max-height: 110px;
  }
  .item-secondary-column.files {
    width: 100%;
    overflow-x: auto;
  }
  .item-main-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .item-main-content button {
    min-width: 90px;
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
          class:selected={$selected_product && $selected_product.id === item.product.id}>
          <div class="item-main-content">
            <div class="item-content">
              <div class="item-column">
                <span>{item.product.title}</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Suma datorata</span>
                <span>{item.product.bookValueAmount} RON</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Pret</span>
                <span>{item.product.priceAmount} RON</span>
              </div>
              <div class="item-column">
                <span class="item-column-header">Profit</span>
                <span>
                  {item.product.bookValueAmount - item.product.priceAmount} RON
                </span>
              </div>
            </div>
            {#if $current_user && $current_user.id === item.product.merchantId}
              <button
                class="item-action"
                on:click={openDeleteModal(item.product)}
                type="button">
                {$_('list.remove')}
              </button>
            {:else}
              <button
                class="primary item-action"
                on:click={openIssueBuyModal(item.product)}
                type="button">
                {$_('list.buy')}
              </button>
            {/if}
          </div>
          {#if $selected_product && item && $selected_product.product.id === item.product.id}
            <div class="item-secondary-content">
              <div class="item-secondary-column files">
                {#each item.pdfNames as pdf}
                  <img
                    src="./PDF_file_icon.png"
                    alt={pdf}
                    on:click={e => downloadPDF(item.product.id, pdf)} />
                {/each}
                {#each item.thumbnails as photo, i}
                  <img
                    src={`data:image/png;base64,${photo.base64Thumbnail}`}
                    alt={photo.name}
                    on:click={e => openImgModal(item.product.id, photo.name, i)} />
                {/each}
                {#if item.hasOtherDocuments}
                  <img
                    src={`./ZIP_file_icon.png}`}
                    alt={'Alte documente'}
                    on:click={e => downloadZIP(item.product.id)} />
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {:else if isLoading}
      <LoadingSpinner {isLoading} />
    {:else if hasLoadingError}
      <div in:fade|local class="no-items no-scroll loading-error">
        <span>A apărut o eroare</span>
        <button class="primary" on:click={loadItems} type="button">
          {$_('list.tryAgain')}
        </button>
      </div>
    {:else if !isLoading && (!items || items.length === 0)}
      <div transition:fade|local class="no-items no-scroll">
        <span>În acest moment nu există o creanță listată</span>
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
<ImgModal bind:this={imgModal} on:change={e => changeImg(e.detail)} />
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
