<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import EntityTable from "../../components/tables/EntityTable.svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import SmartDropdown from "../../components/common/SmartDropdown.svelte";
  import InputLabel from "../../components/common/inputs/Input-Label.svelte";
  import Modal from "../../components/common/Modal.svelte";
  import EntityModal from "../../components/modals/Entity-Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import { RepresentativeService } from "../../services/legalSubject-service.js";
  import { current_user } from "../../store.js";
  import { _ } from "../../i18n";
  const dispatch = createEventDispatcher();
  let form,
    toast,
    amountErrors = [],
    debtorTable,
    deleteModal,
    entityModal,
    debtors = [],
    debtorToDelete = null,
    error = null;
  async function submitRepresentative() {
    updateDebtors();
  }
  function toggleEntityModal(e) {
    e.preventDefault();
    e.stopPropagation();
    const entity = e.detail;
    let title = entity ? $_("entity.editDebtor") : $_("entity.addDebtor");
    if (entity && entity.value) {
      entity.value.type = entity.value.kind.toString();
      if (entity.value.card) {
        entity.value.card.expiryDate = entity.value.card.expiryDate.split(
          "T"
        )[0];
      }
      entityModal.open({ title, entity: entity.value });
    } else {
      entityModal.open({ title, entity: null });
    }
  }
  function toggleDeleteModal(e) {
    e.preventDefault();
    e.stopPropagation();
    const entity = e.detail;
    if (entity && entity.value) {
      debtorToDelete = entity.value;
      deleteModal.open({
        title: `${$_("entity.delete")} '${entity.value.name ||
          entity.value.firstname + " " + entity.value.lastname}'`
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
      result = await RepresentativeService.delete(debtorToDelete.id);
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
    updateDebtors();
  }
  function dispatchDebtorTable(e) {
    error = e.detail.selectedEntity ? null : "Debtor is required";
    dispatch("debtor", e.detail);
  }
  function amountsValidation() {
    if (
      form.priceAmount.value.length > 0 &&
      form.bookValueAmount.value.length > 0 &&
      Number(form.priceAmount.value) >= Number(form.bookValueAmount.value)
    ) {
      form.priceAmount.setCustomValidity(
        $_("sellProduct.price.error.hasToBeSmallerThanOwedAmount")
      );
      amountErrors = [
        $_("sellProduct.price.error.hasToBeSmallerThanOwedAmount")
      ];
    } else {
      form.priceAmount.setCustomValidity("");
      amountErrors = [];
    }
  }
  async function updateDebtors() {
    const rawDebtors = await RepresentativeService.get(
      $current_user.id,
      null,
      null
    );
    debtors = rawDebtors.map(d => ({
      id: d.id,
      value: d,
      label: d.kind === 0 ? `${d.firstname} ${d.lastname}` : d.name
    }));
  }
  onMount(async () => {
    updateDebtors();
    form.addEventListener("input", () => {
      dispatch("input", form.checkValidity());
    });
    form.documents.addEventListener("invalid", () => {
      dispatch("input", false);
    });
    form.bookValueAmount.addEventListener("input", amountsValidation);
    form.priceAmount.addEventListener("input", amountsValidation);
    dispatch("mount", form);
  });
</script>

<style>
  .container {
    flex-grow: 1;
  }
  .error {
    color: red;
    font-size: 0.8em;
  }
</style>

<div class="container">
  <form bind:this={form} onsubmit="event.preventDefault(); return;">
    <SInput
      type={'text'}
      id={'title'}
      name={'title'}
      label="sellProduct.title"
      required={true}
      helpMessage={'Tipul creantei'} />
    <SInput
      type={'file'}
      id={'documents'}
      name={'documents'}
      label="sellProduct.documents"
      accept={'image/*,application/pdf'}
      required={true}
      multiple={true}
      displayFileName={false}
      uploadLabel={'fileUpload.uploadFiles'}
      showPreview={false}
      helpMessage={'Documente pentru creanta'} />
    <SInput
      type={'number'}
      id={'bookValueAmount'}
      name={'bookValueAmount'}
      label="sellProduct.owedAmount"
      helpMessage={'Valorea creantei'}
      required={true} />
    <SInput
      type={'number'}
      id={'priceAmount'}
      name={'priceAmount'}
      label="sellProduct.price"
      required={true}
      externalErrors={amountErrors}
      helpMessage={'Pretul cu care vrei sa vinzi creanta'} />
    <InputLabel
      required={true}
      label={'sellProduct.debtor'}
      helpMessage={'The debtor who owes the debt'} />
    <SmartDropdown
      items={debtors}
      on:add={e => toggleEntityModal(e)}
      on:select={e => dispatch('debtor', e.detail ? e.detail.value : null)}
      on:edit={e => toggleEntityModal(e)}
      on:delete={e => toggleDeleteModal(e)} />
    <SInput
      type={'file'}
      id={'otherDocuments'}
      name={'otherDocuments'}
      label="sellProduct.otherDocuments"
      accept={null}
      required={false}
      multiple={true}
      displayFileName={false}
      uploadLabel={'fileUpload.uploadFiles'}
      showPreview={false} />
    <SInput
      type={'textarea'}
      id={'details'}
      name={'details'}
      label="sellProduct.details"
      required={false} />
  </form>
</div>
<Modal bind:this={deleteModal}>
  <div slot="content">
    {$_('entity.areYouSureYouWishToDelete')} '{debtorToDelete.name || debtorToDelete.firstname + ' ' + debtorToDelete.lastname}'?
  </div>
  <div slot="actions">
    <button on:click={deleteEntity} type="button">{$_('entity.yes')}</button>
    <button on:click={e => toggleDeleteModal(e)} type="button">
      {$_('entity.no')}
    </button>
  </div>
</Modal>
<EntityModal bind:this={entityModal} on:submit={submitRepresentative} />
<Toast bind:this={toast} />
