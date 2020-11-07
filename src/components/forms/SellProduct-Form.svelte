<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import EntityTable from "../../components/tables/EntityTable.svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import InputLabel from "../../components/common/inputs/Input-Label.svelte";
  import { current_user } from "../../store.js";
  import { _ } from "../../i18n";
  const dispatch = createEventDispatcher();
  let form,
    amountErrors = [],
    debtorTable,
    error = null;
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
  onMount(() => {
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
      for={'debtor'}
      label={'sellProduct.debtor'}
      helpMessage={'The debtor who owes the debt'} />
    <EntityTable
      bind:this={debtorTable}
      selectable={true}
      on:select={dispatchDebtorTable} />
    {#if error}
      <div transition:slide>
        <p class="error">{error}</p>
      </div>
    {/if}
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
