<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { UserService } from "../../services/user-service.js";
  import { current_user } from "../../store.js";
  import { Utils } from "../../utils.js";
  import VerifyUserForm from "../../components/forms/VerifyUser-Form.svelte";
  import Modal from "../../components/common/Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import { _ } from "../../i18n";
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
      toast.create($_("verifyAccount.accountActivated"), 3000);
      close();
    } catch (error) {
      toast.create($_("verifyAccount.accountFailActivate"), 3000, "#e46464");
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
    width: 400px;
  }
  .explanations {
    padding: 20px 20px 40px 0;
  }
  .form p {
    font-size: 1.25em;
    padding: 10px 0;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <div class="explanations">
      <p>{$_('verifyAccount.explanation1')}</p>
      <p>{$_('verifyAccount.explanation2')}</p>
    </div>
    <VerifyUserForm on:mount={e => (form = e.detail)} on:input={isValid} />
  </div>
  <div slot="actions">
    <button
      class="primary"
      disabled={!canVerify}
      on:click={submit}
      type="button">
      {$_('verifyAccount.submit')}
    </button>
    <button on:click={close} type="button">{$_('verifyAccount.cancel')}</button>
  </div>
</Modal>
<Toast bind:this={toast} />
