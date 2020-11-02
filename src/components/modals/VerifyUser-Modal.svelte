<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { UserService } from "../../services/user-service.js";
  import { current_user } from "../../store.js";
  import { Utils } from "../../utils.js";
  import VerifyUserForm from "../../components/forms/VerifyUser-Form.svelte";
  import Modal from "../../components/common/Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  let modal,
    form,
    toast,
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
      formData.append("idPhoto", form.photo.files[0], form.photo.files[0].name);
      current_user.set(await UserService.verify(formData));
      toast.create(`Account verified successfully`, 3000);
      close();
    } catch (error) {
      toast.create(`Failed to verify account`, 3000, "#e46464");
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
    <button disabled={!canVerify} on:click={submit} type="button">
      Submit
    </button>
    <button on:click={close} type="button">Cancel</button>
  </div>
</Modal>
<Toast bind:this={toast} />
