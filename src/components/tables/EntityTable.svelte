<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    ChevronRightIcon,
    ChevronsRightIcon,
    ChevronLeftIcon,
    ChevronsLeftIcon
  } from "svelte-feather-icons";
  import { RepresentativeService } from "../../services/legalSubject-service.js";
  import Modal from "../../components/common/Modal.svelte";
  import EntityModal from "../../components/modals/Entity-Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import { current_user } from "../../store.js";
  import { _ } from "../../i18n";
  export let selectable = false;
  const take = 6,
    dispatch = createEventDispatcher();
  let toast,
    deleteModal,
    entityModal,
    entityToDelete = null,
    types = [$_("entity.physical"), $_("entity.juridical")],
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
    let title = entity ? $_("entity.editDebtor") : $_("entity.addDebtor");
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
        title: `${$_("entity.delete")} '${entity.name ||
          entity.firstname + " " + entity.lastname}'`
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
      result = false;
    }
    toast.create(
      result ? $_("entity.debtorDeleted") : $_("entity.debtorFailDelete"),
      3000,
      result ? null : errorToastColor
    );
    deleteModal.toggleLoading();
    deleteModal.close();
    if (result) {
      refreshList(true);
      dispatch("change");
    }
  }
  function submitRepresentative() {
    refreshList(true);
    dispatch("change");
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
    selectedEntity =
      selectedEntity && selectedEntity.id === entity.id ? null : entity;
    dispatch("select", { selectedEntity });
  }
  export async function refreshList(alsoCount) {
    try {
      entities = await RepresentativeService.get($current_user.id, skip, take);
      if (alsoCount) {
        await refreshCount();
      }
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
    refreshList(true);
  });
</script>

<style>
  .container {
    flex-grow: 1;
  }
  .actions {
    display: flex;
    justify-content: flex-start;
  }
  .actions button {
    min-width: 100px;
    width: 7vw;
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
    <button
      class="primary"
      on:click={e => toggleEntityModal(e, null)}
      type="button">
      {$_('entity.add')}
    </button>
  </div>
  <table>
    <thead>
      <tr>
        <th>{$_('entity.name')}</th>
        <th>{$_('entity.type')}</th>
        <th>{$_('entity.address')}</th>
        <th>{$_('entity.email')}</th>
        <th>{$_('entity.actions')}</th>
      </tr>
    </thead>
    <tbody>
      {#if !entities}
        <tr>
          <td colspan="100%">
            <div class="no-entities">{$_('entity.loadingEntities')}</div>
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
              <div class="td-content">{entity.address}</div>
            </td>
            <td>
              <div class="td-content">{entity.email}</div>
            </td>
            <td>
              <div class="td-content">
                <button
                  on:click={e => toggleEntityModal(e, entity)}
                  type="button">
                  {$_('entity.edit')}
                </button>
                <button
                  on:click={e => toggleDeleteModal(e, entity)}
                  type="button">
                  {$_('entity.delete')}
                </button>
              </div>
            </td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="100%">
            <div class="no-entities">{$_('entity.noEntitiesFound')}</div>
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
            <span>{$_('entity.page')}</span>
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
            <span>{$_('entity.outOf')} {maxPage}</span>
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
    {$_('entity.areYouSureYouWishToDelete')} '{entityToDelete.name || entityToDelete.firstname + ' ' + entityToDelete.lastname}'?
  </div>
  <div slot="actions">
    <button on:click={deleteEntity} type="button">{$_('entity.yes')}</button>
    <button on:click={e => toggleDeleteModal(e, null)} type="button">
      {$_('entity.no')}
    </button>
  </div>
</Modal>
<EntityModal bind:this={entityModal} on:submit={submitRepresentative} />
<Toast bind:this={toast} />
