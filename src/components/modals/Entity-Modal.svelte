<script>
  import Modal from "../../components/common/Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import EntityForm from "../forms/Entity-Form.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { RepresentativeService } from "../../services/legalSubject-service.js";
  import { current_user } from "../../store.js";
  import { _ } from "../../i18n";
  const dispatch = createEventDispatcher();
  let modal,
    toast,
    form,
    settings,
    isEdit = false,
    submitEnabled = false;
  function isValid(e) {
    submitEnabled = e.detail;
  }
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  function mountForm(e) {
    form = e.detail;
    const entity = settings.entity;
    if (entity) {
      isEdit = true;
      form[entity.type.toString()].click();
      Utils.afterDOMRender(() => {
        form.email.value = entity.email;
        form.address.value = entity.address;
        if (entity.type === "0") {
          form.firstName.value = entity.firstname;
          form.lastName.value = entity.lastname;
          form.cnp.value = entity.card.cnp;
          form.expiryDate.value = entity.card.expiryDate;
          form.identityIssuer.value = entity.card.identityIssuer;
          form.number.value = entity.card.number;
          form.series.value = entity.card.series;
        } else {
          form.name.value = entity.name;
          form.cui.value = entity.cui;
          form.recom.value = entity.recom;
        }
      });
    }
  }
  async function submit() {
    modal.toggleLoading();
    try {
      const data = Utils.formToJSON(form);
      const entParams = {
        type: Number(data.cnp ? "0" : "1"),
        userId: $current_user.id,
        rawEntity: JSON.stringify(data),
        rawCard: JSON.stringify(data)
      };
      let result;
      if (isEdit) {
        result = await RepresentativeService.update(data);
      } else {
        result = await RepresentativeService.add(entParams);
      }
      modal.toggleLoading();
      if (typeof result === "string") {
        throw Error("Error occured in backend");
      }
      toast.create(`${isEdit ? $_("entityModal.debtorEdited") : $_("entityModal.debtorAdded")}`, 3000);
      dispatch("submit");
      close();
    } catch (ex) {
      toast.create(
        `Failed to ${isEdit ? $_("entityModal.debtorFailEdit") : $_("entityModal.debtorFailAdd")} debtor`,
        3000,
        "#e46464"
      );
      console.log(ex);
    }
  }
  function close(fromModal) {
    submitEnabled = false;
    isEdit = false;
    if (!fromModal) {
      modal.close();
    }
    dispatch("close");
  }
</script>

<style>
  .content {
    width: 30vw;
  }
</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div class="content" slot="content">
    <EntityForm on:mount={mountForm} on:input={isValid} />
  </div>
  <div slot="actions">
    <button
      class="primary"
      disabled={!submitEnabled}
      on:click={submit}
      type="button">
      {$_('entityModal.submit')}
    </button>
    <button on:click={() => close(false)} type="button">
      {$_('entityModal.cancel')}
    </button>
  </div>
</Modal>
<Toast bind:this={toast} />
