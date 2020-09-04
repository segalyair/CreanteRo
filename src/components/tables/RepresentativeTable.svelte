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
  let deleteModal,
    representativeModal,
    representativeToDelete = null,
    types = { "0": "Physical", "1": "Juridical" },
    representatives = [
      {
        type: "0",
        firstname: "First Name",
        lastname: "Last Name",
        card: {
          cnp: "2901111015799",
          series: "PX",
          nr: "000000",
          issuer: "S.P.C.L.E.P.",
          expiryDate: "11.11.1990"
        }
      },
      { type: "1", name: "Company Name is Nice" }
    ],
    goToPage = false,
    currentPage = 1,
    maxPage = 20;
  function toggleRepresentativeModal(rep) {
    let title = rep ? "Edit representative" : "Add new representative";
    representativeModal.open({ title, rep });
  }
  function toggleDeleteModal(rep) {
    representativeToDelete = rep;
    if (rep !== null) {
      deleteModal.open({
        title: `Delete '${rep.name || rep.firstname + ' ' + rep.lastname}'`
      });
    } else {
      deleteModal.close();
    }
  }
  function deleteRepresentative() {
    deleteModal.close();
  }
  function changePage(e, page) {
    e.preventDefault();
    e.stopPropagation();
    currentPage = Math.min(maxPage, Math.max(1, Number(page)));
  }
  function submitGoToPage(e) {
    if (e.key === "Enter") {
      //change page code goes here
      currentPage = Math.min(maxPage, Math.max(1, Number(e.target.value)));
      toggleGoToPage();
    }
  }
  function toggleGoToPage(e) {
    if (e !== undefined && e.type !== "click") return;
    goToPage = !goToPage;
  }
  onMount(async () => {
    // representatives = await RepresentativeService.get();
  });
</script>

<style>
  table {
    border-collapse: collapse;
    user-select: none;
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
      {#each representatives as rep}
        <tr>
          <td>{rep.name || `${rep.firstname} ${rep.lastname}`}</td>
          <td>{types[rep.type]}</td>
          <td>
            <button on:click={() => toggleRepresentativeModal(rep)}>
              Edit
            </button>
            <button on:click={() => toggleDeleteModal(rep)}>Delete</button>
          </td>
        </tr>
      {/each}
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
<RepresentativeModal bind:this={representativeModal} />
