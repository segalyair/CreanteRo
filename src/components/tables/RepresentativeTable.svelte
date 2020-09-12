<script>
  import { onMount } from "svelte";
  import {
    ChevronRightIcon,
    ChevronsRightIcon,
    ChevronLeftIcon,
    ChevronsLeftIcon
  } from "svelte-feather-icons";
  import { RepresentativeService } from "../../services/representative-service.js";
  import Modal from "../../components/common/Modal.svelte";
  import RepresentativeModal from "../../components/modals/Representative-Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import { current_user } from "../../store.js";
  const take = 6;
  let toast,
    deleteModal,
    representativeModal,
    representativeToDelete = null,
    types = ["Physical", "Juridical"],
    representatives = null, //[
    // {
    //   id: 1,
    //   type: "0",
    //   address: "Casa Blanca",
    //   firstname: "First Name",
    //   lastname: "Last Name",
    //   card: {
    //     cnp: "2901111015799",
    //     series: "PX",
    //     nr: "000000",
    //     issuer: "S.P.C.L.E.P.",
    //     expiryDate: "1990-10-10"
    //   }
    // },
    // {
    //   id: 2,
    //   type: "1",
    //   address: "Casa Blanca 2",
    //   name: "Company Name is Nice",
    //   card: {
    //     cnp: null,
    //     series: null,
    //     nr: null,
    //     issuer: null,
    //     expiryDate: null
    //   }
    // }
    //]
    goToPage = false,
    currentPage = 1,
    maxPage = 20,
    skip = 0,
    totalReps = 0;
  function toggleRepresentativeModal(rep) {
    let title = rep ? "Edit representative" : "Add new representative";
    representativeModal.open({ title, rep });
  }
  function toggleDeleteModal(rep) {
    representativeToDelete = rep;
    if (rep !== null) {
      deleteModal.open({
        title: `Delete '${rep.name || rep.firstname + " " + rep.lastname}'`
      });
    } else {
      deleteModal.close();
    }
  }
  async function deleteRepresentative() {
    const errorToastColor = "#e46464";
    let result = false;
    deleteModal.toggleLoading();
    try {
      result = await RepresentativeService.delete(representativeToDelete.id);
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
  async function refreshList() {
    try {
      representatives = await RepresentativeService.get(
        $current_user.id,
        skip,
        take
      );
    } catch (error) {
      representatives = [];
      console.log(error);
    }
  }
  async function refreshCount() {
    totalReps = await RepresentativeService.count($current_user.id);
    maxPage = Math.ceil((totalReps + 1) / 6);
    currentPage = Math.min(currentPage, maxPage);
  }
  onMount(() => {
    refreshList();
    refreshCount();
  });
</script>

<style>
  table {
    border-collapse: collapse;
    user-select: none;
    width: 30vw;
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
  .no-representatives {
    font-size: 1.5rem;
    font-weight: 100;
    padding: 30px;
  }
</style>

<div>
  <div>
    <button on:click={() => toggleRepresentativeModal(null)}>
      Add Representative
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
      {#if !representatives}
        <tr>
          <td colspan="100%">
            <div class="no-representatives">Loading representatives</div>
          </td>
        </tr>
      {:else if representatives.length > 0}
        {#each representatives as rep}
          <tr>
            <td>
              <div class="td-content">
                {rep.name || `${rep.firstname} ${rep.lastname}`}
              </div>
            </td>
            <td>
              <div class="td-content">{types[rep.type]}</div>
            </td>
            <td>
              <div class="td-content">
                <button on:click={() => toggleRepresentativeModal(rep)}>
                  Edit
                </button>
                <button on:click={() => toggleDeleteModal(rep)}>Delete</button>
              </div>
            </td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="100%">
            <div class="no-representatives">No representatives found</div>
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
    Are you sure you wish to delete '{representativeToDelete.name || representativeToDelete.firstname + ' ' + representativeToDelete.lastname}'?
  </div>
  <div slot="actions">
    <button on:click={deleteRepresentative}>Yes</button>
    <button on:click={() => toggleDeleteModal(null)}>No</button>
  </div>
</Modal>
<RepresentativeModal
  bind:this={representativeModal}
  on:submit={submitRepresentative} />
<Toast bind:this={toast} />
