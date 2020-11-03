<script>
  import Modal from "../../components/common/Modal.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let modal,
    settings,
    isEdit = false;
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  function close(fromModal) {
    if (!fromModal) {
      modal.close();
    }
    dispatch("close");
  }
</script>

<style>
  img {
    user-select: none;
  }
</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div class="content" slot="content">
    <img src="logo200.png" alt="full" />
  </div>
</Modal>
