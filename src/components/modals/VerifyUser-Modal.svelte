<script>
  import VerifyUserForm from "../../components/forms/VerifyUser-Form.svelte";
  import Modal from "../../components/common/Modal.svelte";
  let modal, settings;
  async function submit() {}
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  function close() {
    modal.close();
    Utils.afterDOMRender(() => {
      model = {};
    });
    dispatch("close");
  }
</script>

<style>
  .form {
    width: 28vw;
  }
  .form p {
    padding: 20px 20px 20px 0;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <p>We need you to verify your account before continuing</p>
    <VerifyUserForm />
  </div>
  <div slot="actions">
    <button on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
