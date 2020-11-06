<script>
  import { onMount } from "svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import { createEventDispatcher } from "svelte";
  import { _ } from "../../i18n";
  let form, selectedType;
  const dispatch = createEventDispatcher();
  onMount(() => {
    form.addEventListener("input", () => {
      dispatch("input", form.checkValidity());
    });
    form.physical.addEventListener("input", e => {
      selectedType = "physical";
    });
    form.juridical.addEventListener("input", e => {
      selectedType = "juridical";
    });
    dispatch("mount", form);
  });
</script>

<style>
  .container {
    display: flex;
    justify-content: center;
  }
  p {
    padding: 10px 10px 10px 0;
    font-weight: bold;
    font-size: 1.25em;
  }
</style>

<div class="container">
  <form bind:this={form} onsubmit="event.preventDefault(); return;">
    <SInput
      type={'radio'}
      id={'type'}
      group={'type'}
      label={'entityModal.type'}
      buttons={[{ label: $_('entity.physical'), for: 'physical', value: '0' }, { label: $_('entity.juridical'), for: 'juridical', value: '1' }]}
      required={true} />
    {#if selectedType}
      <SInput
        type={'email'}
        id={'email'}
        name={'email'}
        label="entityModal.email"
        required={true} />
      {#if selectedType == 'physical'}
        <SInput
          type={'text'}
          id={'firstName'}
          name={'firstName'}
          label="entityModal.firstName"
          required={true} />
        <SInput
          type={'text'}
          id={'lastName'}
          name={'lastName'}
          label="entityModal.lastName"
          required={true} />
        <SInput
          type={'number'}
          id={'cnp'}
          name={'cnp'}
          label="entityModal.cnp"
          required={true}
          pattern={new RegExp(/\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b/)} />
        <SInput
          type={'text'}
          id={'series'}
          name={'series'}
          label="entityModal.series"
          required={true}
          pattern={new RegExp(/[A-Z]{2}/)} />
        <SInput
          type={'number'}
          id={'number'}
          name={'number'}
          label="entityModal.number"
          required={true}
          pattern={new RegExp(/^[0-9]{6}/)} />
        <SInput
          type={'text'}
          id={'identityIssuer'}
          name={'identityIssuer'}
          label="entityModal.identityIssuer"
          required={true} />
        <SInput
          type={'date'}
          id={'expiryDate'}
          name={'expiryDate'}
          label="entityModal.expiryDate"
          required={true} />
      {:else}
        <SInput
          type={'text'}
          id={'name'}
          name={'name'}
          label="entityModal.name"
          required={true} />
        <SInput
          type={'text'}
          id={'cui'}
          name={'cui'}
          label="entityModal.cui"
          required={true} />
        <SInput
          type={'text'}
          id={'recom'}
          name={'recom'}
          label="entityModal.recom"
          required={true} />
      {/if}
      <SInput
        type={'text'}
        id={'address'}
        name={'address'}
        label="entityModal.address"
        required={true} />
    {/if}
  </form>
</div>
