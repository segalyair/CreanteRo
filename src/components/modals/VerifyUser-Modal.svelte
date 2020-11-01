<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { UserService } from "../../services/user-service.js";
  import { current_user } from "../../store.js";
  import { Utils } from "../../utils.js";
  import VerifyUserForm from "../../components/forms/VerifyUser-Form.svelte";
  import Modal from "../../components/common/Modal.svelte";
  let modal,
    form,
    settings,
    canVerify = false;
  const dispatch = createEventDispatcher();
  function isValid(e) {
    canVerify = e.detail;
  }
  async function submit() {
    modal.toggleLoading();
    try {
      const formData = new FormData(),
        data = Utils.formToJSON(form);
      formData.set(
        "verifyUserParams",
        JSON.stringify({
          userId: $current_user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address
        })
      );
      formData.set(
        "identityCardRaw",
        JSON.stringify({
          cnp: data.cnp,
          series: data.series,
          number: data.number,
          identityIssuer: data.identityIssuer,
          expiryDate: data.expiryDate
        })
      );
      formData.set(
        "bankAccountRaw",
        JSON.stringify({
          iban: data.iban,
          bankName: data.bankName
        })
      );
      formData.append("photo", form.photo.files[0], form.photo.files[0].name);
      current_user.set(await UserService.verify(formData));
      close();
    } catch (error) {
      console.log(error);
    }
    modal.toggleLoading();
  }
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  function close() {
    modal.close();
    dispatch("close");
  }
</script>

<style>
  .form {
    width: 28vw;
  }
  .form p {
    font-size: 1.25em;
    padding: 20px 20px 20px 0;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <p>We need you to verify your account first</p>
    <VerifyUserForm on:mount={e => (form = e.detail)} on:input={isValid} />
  </div>
  <div slot="actions">
    <button disabled={!canVerify} on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
