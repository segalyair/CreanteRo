<script>
  import Modal from "../../components/common/Modal.svelte";
  import Dropdown from "../common/Dropdown.svelte";
  import FileUpload from "../common/FileUpload.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { slide } from "svelte/transition";
  const dispatch = createEventDispatcher();
  let modal,
    model = {
      title: null,
      seller: null,
      debtGuarantee: false,
      debtGuaranteeProof: null,
      debtGuaranteeDetails: null,
      debtorSolvent: false,
      debtorSolventDetails: null
    },
    settings;
  $: {
    console.log(model);
  }
  $: submitEnabled =
    notEmptyRequirement(model.title) && notEmptyRequirement(model.seller);
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  async function submit() {
    if (!model.title || model.title.length === 0) return;
    modal.toggleLoading();
    const guid = Utils.create_UUID();
    if (model.image) {
      await FirebaseAPI.uploadFile("items", model.image, guid);
    }
    const newItem = await FirebaseAPI.add("items", {
      id: guid,
      creationDate: new Date().toISOString(),
      value: model.title,
      image: model.image !== undefined && model.image !== null
    });
    modal.toggleLoading();
    dispatch("submit", newItem);
    close();
  }
  function close() {
    modal.close();
    Utils.afterDOMRender(() => {
      model = {};
    });
    dispatch("close");
  }
  function notEmptyRequirement(value) {
    return value && value.length > 0;
  }
</script>

<style>
  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 500px;
  }
  .required {
    color: red;
    font-size: 22px;
  }
  .form label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .div-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .label-text {
    margin-right: 10px;
    min-width: 200px;
    text-align: right;
  }
  input {
    margin: 0;
    flex-grow: 1;
  }
  input[type="checkbox"] {
    flex-grow: 1;
    align-self: center;
    margin: 0;
    outline: none;
  }
  textarea {
    resize: vertical;
    flex-grow: 1;
    margin: 0;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <label>
      <span class="label-text">
        Title
        <span class="required">*</span>
      </span>
      <input
        type="text"
        bind:value={model.title}
        on:input={notEmptyRequirement(model.title)} />
    </label>
    <label>
      <span class="label-text">
        Amount Due
        <span class="required">*</span>
      </span>
      <input
        type="text"
        bind:value={model.amountDue}
        on:input={notEmptyRequirement(model.amountDue)} />
    </label>
    <label>
      <span class="label-text">Is the debt guaranteed?</span>
      <input type="checkbox" bind:checked={model.debtGuarantee} />
    </label>
    {#if model.debtGuarantee}
      <label transition:slide|local>
        <span class="label-text">
          Guarantee Proof
          <span class="required">*</span>
        </span>
        <FileUpload
          on:file={event => (model.debtGuaranteeProof = event.detail)} />
      </label>
    {/if}
    <label>
      <span class="label-text">Details</span>
      <textarea bind:value={model.debtGuaranteeDetails} />
    </label>
    <div class="div-label">
      <span class="label-text">
        Is the debtor solvent?
        <span class="required">*</span>
      </span>
      <Dropdown
        items={[{ value: 'Yes' }, { value: 'No' }, { value: "I don't know" }]} />
    </div>
    <label>
      <span class="label-text">Details</span>
      <textarea bind:value={model.debtorSolventDetails} />
    </label>
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
