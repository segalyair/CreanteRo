<script>
  import { onMount } from "svelte";
  import { RepresentativeService } from "../../services/representative-service.js";
  import Modal from "../../components/common/Modal.svelte";
  import RepresentativeModal from "../../components/modals/Representative-Modal.svelte";
  let deleteModal,
    representativeModal,
    representativeToDelete = null,
    representatives = [{ name: "aha", type: "Physical" }];
  function toggleRepresentativeModal(rep) {
    let title = rep ? "Edit representative" : "Add new representative";
    representativeModal.open({ title });
  }
  function toggleDeleteModal(rep) {
    representativeToDelete = rep;
    if (rep !== null) {
      deleteModal.open({
        title: `Delete '${rep.name}'`
      });
    } else {
      deleteModal.close();
    }
  }
  function deleteRepresentative() {
    deleteModal.close();
  }
  onMount(async () => {
    // representatives = await RepresentativeService.get();
  });
</script>

<style>
  table {
    border-collapse: collapse;
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
</style>

<div>
  <div>
    <button on:click={() => toggleRepresentativeModal(null)}>Add Representative</button>
  </div>
  <table>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Actions</th>
    </tr>
    {#each representatives as rep}
      <tr>
        <td>{rep.name}</td>
        <td>{rep.type}</td>
        <td>
          <button on:click={() => toggleRepresentativeModal(rep)}>Edit</button>
          <button on:click={() => toggleDeleteModal(rep)}>Delete</button>
        </td>
      </tr>
    {/each}
  </table>
</div>
<Modal bind:this={deleteModal}>
  <div slot="content">
    Are you sure you wish to delete '{representativeToDelete.name}'?
  </div>
  <div slot="actions">
    <button on:click={deleteRepresentative}>Yes</button>
    <button on:click={() => toggleDeleteModal(null)}>No</button>
  </div>
</Modal>
<RepresentativeModal bind:this={representativeModal} />
