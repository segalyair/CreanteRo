<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    ChevronRightIcon,
    ChevronsRightIcon,
    ChevronLeftIcon,
    ChevronsLeftIcon
  } from "svelte-feather-icons";
  import { RepresentativeService } from "../../services/representative-service.js";
  import Modal from "../../components/common/Modal.svelte";
  import EntityModal from "../../components/modals/Entity-Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import { current_user } from "../../store.js";
  export let selectable = false;
  const take = 6,
    dispatch = createEventDispatcher();
  let toast,
    deleteModal,
    entityModal,
    entityToDelete = null,
    types = ["Physical", "Juridical"],
    entities = null,
    selectedEntity = null,
    goToPage = false,
    currentPage = 1,
    maxPage = 20,
    skip = 0,
    totalEntities = 0;
  function toggleEntityModal(e, entity) {
    e.preventDefault();
    e.stopPropagation();
    let title = entity ? "Edit representative" : "Add new representative";
    if (entity) {
      entity.type = entity.kind.toString();
      if (entity.card) {
        entity.card.expiryDate = entity.card.expiryDate.split("T")[0];
      }
    }
    entityModal.open({ title, entity });
  }
  function toggleDeleteModal(e, entity) {
    e.preventDefault();
    e.stopPropagation();
    entityToDelete = entity;
    if (entity !== null) {
      deleteModal.open({
        title: `Delete '${entity.name || entity.firstname + " " + entity.lastname}'`
      });
    } else {
      deleteModal.close();
    }
  }
  async function deleteEntity() {
    const errorToastColor = "#e46464";
    let result = false;
    deleteModal.toggleLoading();
    try {
      result = await RepresentativeService.delete(entityToDelete.id);
    } catch (error) {
      result = true;
    }
    toast.create(
      result ? "Representative deleted" : "Failed to delete representative",
      3000,
      result ? null : errorToastColor
    );
    deleteModal.toggleLoading();
    deleteModal.close();
    if (result) {
      refreshCount();
      refreshList();
    }
  }
  function submitRepresentative() {
    refreshList();
    refreshCount();
  }
  function changePage(e, page) {
    e.preventDefault();
    e.stopPropagation();
    currentPage = Math.min(maxPage, Math.max(1, Number(page)));
    skip = (currentPage - 1) * take;
    refreshList();
  }
  function submitGoToPage(e) {
    if (e.key === "Enter") {
      changePage(e, e.target.value);
      toggleGoToPage();
    }
  }
  function toggleGoToPage(e) {
    if (e !== undefined && e.type !== "click") return;
    goToPage = !goToPage;
  }
  function selectRow(entity) {
    if (!selectable) return;
    selectedEntity = selectedEntity && selectedEntity.id === entity.id ? null : entity;
    dispatch("select", { selectedEntity });
  }
  async function refreshList() {
    try {
      entities = await RepresentativeService.get(
        $current_user.id,
        skip,
        take
      );
    } catch (error) {
      entities = [];
      console.log(error);
    }
  }
  async function refreshCount() {
    totalEntities = await RepresentativeService.count($current_user.id);
    maxPage = Math.ceil((totalEntities + 1) / 6);
    currentPage = Math.min(currentPage, maxPage);
  }
  onMount(() => {
    refreshList();
    refreshCount();
  });
</script>

<style>
  .container {
    flex-grow: 1;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  table {
    border-collapse: collapse;
    user-select: none;
    width: 100%;
  }
  th,
  td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  td {
    width: 200px;
  }
  td button {
    width: 70px;
  }
  .td-paginator {
    padding: 0;
  }
  .paginator {
    font-size: 0.75rem;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .paginator span {
    margin: 0 2px;
  }

  .icon-container:hover,
  .currentPage:hover {
    text-decoration: underline;
    cursor: pointer;
    color: lightblue;
  }
  .icon-container {
    cursor: pointer;
    margin-left: 5px;
    display: flex;
  }
  .icon-container.disabled {
    color: lightgray !important;
    cursor: initial;
    pointer-events: none;
  }
  input[type="number"] {
    margin: 0;
    width: 40px;
    height: 25px;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .no-entities {
    font-size: 1.5rem;
    font-weight: 100;
    padding: 30px;
  }
  .selectable:hover:not(.selected) {
    background-color: rgba(173, 216, 230, 0.2);
    transition: background-color 200ms;
    cursor: pointer;
  }
  .selected {
    background-color: rgba(173, 216, 230, 0.4);
    cursor: pointer;
  }
</style>

<div class="container">
  <div class="actions">
    <button on:click={e => toggleEntityModal(e, null)}>
      Add
    </button>
  </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if !entities}
        <tr>
          <td colspan="100%">
            <div class="no-entities">Loading entities</div>
          </td>
        </tr>
      {:else if entities.length > 0}
        {#each entities as entity}
          <tr
            class:selectable
            class:selected={selectedEntity && selectedEntity.id === entity.id}
            on:click={() => selectRow(entity)}>
            <td>
              <div class="td-content">
                {entity.name || `${entity.firstname} ${entity.lastname}`}
              </div>
            </td>
            <td>
              <div class="td-content">{types[entity.kind]}</div>
            </td>
            <td>
              <div class="td-content">
                <button on:click={e => toggleEntityModal(e, entity)}>
                  Edit
                </button>
                <button on:click={e => toggleDeleteModal(e, entity)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="100%">
            <div class="no-entities">No entities found</div>
          </td>
        </tr>
      {/if}
    </tbody>
    <tfoot>
      <tr>
        <td class="td-paginator" colspan="100%">
          <div class="paginator">
            <div
              class="icon-container"
              class:disabled={currentPage <= 1}
              on:click={e => changePage(e, 1)}>
              <ChevronsLeftIcon size="18" />
            </div>
            <div
              class="icon-container"
              class:disabled={currentPage <= 1}
              on:click={e => changePage(e, currentPage - 1)}>
              <ChevronLeftIcon size="18" />
            </div>
            <span>Page</span>
            {#if !goToPage}
              <span class="currentPage" on:click={toggleGoToPage}>
                {currentPage}
              </span>
            {:else}
              <input
                on:keydown={submitGoToPage}
                on:blur={() => (goToPage = false)}
                type="number"
                min="1"
                max={maxPage}
                autofocus />
            {/if}
            <span>out of {maxPage}</span>
            <div
              class="icon-container"
              class:disabled={currentPage >= maxPage}
              on:click={e => changePage(e, currentPage + 1)}>
              <ChevronRightIcon size="18" />
            </div>
            <div
              class="icon-container"
              class:disabled={currentPage >= maxPage}
              on:click={e => changePage(e, maxPage)}>
              <ChevronsRightIcon size="18" />
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
<Modal bind:this={deleteModal}>
  <div slot="content">
    Are you sure you wish to delete '{entityToDelete.name || entityToDelete.firstname + ' ' + entityToDelete.lastname}'?
  </div>
  <div slot="actions">
    <button on:click={deleteEntity}>Yes</button>
    <button on:click={() => toggleDeleteModal(null)}>No</button>
  </div>
</Modal>
<EntityModal
  bind:this={entityModal}
  on:submit={submitRepresentative} />
<Toast bind:this={toast} />
