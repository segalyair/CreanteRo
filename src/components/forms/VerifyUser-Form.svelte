<script>
  import { onMount } from "svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import { createEventDispatcher } from "svelte";
  import { _ } from "../../i18n";
  let form;
  const dispatch = createEventDispatcher();
  onMount(() => {
    form.addEventListener("input", () => {
      dispatch("input", form.checkValidity());
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
    <p>{$_("verifyAccount.userInformation")}</p>
    <SInput
      type={'text'}
      id={'firstName'}
      name={'firstName'}
      label="verifyAccount.firstName"
      required={true} />
    <SInput
      type={'text'}
      id={'lastName'}
      name={'lastName'}
      label="verifyAccount.lastName"
      required={true} />
    <SInput
      type={'number'}
      id={'phone'}
      name={'phone'}
      label="verifyAccount.phone"
      required={true} />
    <SInput
      type={'text'}
      id={'address'}
      name={'address'}
      label="verifyAccount.address"
      required={true} />
    <SInput
      type={'file'}
      id={'photo'}
      name={'photo'}
      label="verifyAccount.photo"
      accept={'image/*'}
      displayFileName={false}
      multiple={false}
      required={true} />
    <p>{$_("verifyAccount.bankInformation")}</p>
    <SInput
      type={'text'}
      id={'bankName'}
      name={'bankName'}
      label="verifyAccount.bank"
      required={true} />
    <SInput
      type={'text'}
      id={'iban'}
      name={'iban'}
      label="verifyAccount.iban"
      required={true}
      pattern={new RegExp(/^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$/)} />
    <p>{$_("verifyAccount.identityCard")}</p>
    <SInput
      type={'number'}
      id={'cnp'}
      name={'cnp'}
      label="verifyAccount.cnp"
      required={true}
      pattern={new RegExp(/\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b/)} />
    <SInput
      type={'text'}
      id={'series'}
      name={'series'}
      label="verifyAccount.series"
      required={true}
      pattern={new RegExp(/[A-Z]{2}/)}
      minlength={2}
      maxlength={2} />
    <SInput
      type={'number'}
      id={'number'}
      name={'number'}
      label="verifyAccount.number"
      pattern={new RegExp(/^[0-9]{6}/)}
      required={true} />
    <SInput
      type={'text'}
      id={'identityIssuer'}
      name={'identityIssuer'}
      label="verifyAccount.identityIssuer"
      required={true} />
    <SInput
      type={'date'}
      id={'expiryDate'}
      name={'expiryDate'}
      label="verifyAccount.expiryDate"
      required={true} />
  </form>
</div>
