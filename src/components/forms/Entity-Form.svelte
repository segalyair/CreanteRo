<script>
  import { onMount } from "svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import { createEventDispatcher } from "svelte";
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
      label={'Type'}
      buttons={[{ label: 'Physical', for: 'physical', value: '0' }, { label: 'Juridical', for: 'juridical', value: '1' }]}
      required={true} />
    {#if selectedType}
      <SInput
        type={'email'}
        id={'email'}
        name={'email'}
        label="Email"
        required={true} />
      {#if selectedType == 'physical'}
        <SInput
          type={'text'}
          id={'firstName'}
          name={'firstName'}
          label="First Name"
          required={true} />
        <SInput
          type={'text'}
          id={'lastName'}
          name={'lastName'}
          label="Last Name"
          required={true} />
        <SInput
          type={'number'}
          id={'cnp'}
          name={'cnp'}
          label="CNP"
          required={true}
          pattern={new RegExp(/\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b/)} />
        <SInput
          type={'text'}
          id={'series'}
          name={'series'}
          label="Series"
          required={true}
          pattern={new RegExp(/[A-Z]{2}/)} />
        <SInput
          type={'number'}
          id={'number'}
          name={'number'}
          label="Number"
          required={true}
          pattern={new RegExp(/^[0-9]{6}/)} />
        <SInput
          type={'text'}
          id={'identityIssuer'}
          name={'identityIssuer'}
          label="Issuer"
          required={true} />
        <SInput
          type={'date'}
          id={'expiryDate'}
          name={'expiryDate'}
          label="Expiry Date"
          required={true} />
      {:else}
        <SInput
          type={'text'}
          id={'name'}
          name={'name'}
          label="Name"
          required={true} />
        <SInput
          type={'text'}
          id={'cui'}
          name={'cui'}
          label="CUI"
          required={true} />
        <SInput
          type={'text'}
          id={'recom'}
          name={'recom'}
          label="RECOM"
          required={true} />
      {/if}
      <SInput
        type={'text'}
        id={'address'}
        name={'address'}
        label="Address"
        required={true} />
    {/if}
  </form>
</div>
