<script>
  import Modal from "../../components/common/Modal.svelte";
  import FileUpload from "../common/FileUpload.svelte";
  import FileUploadList from "../common/FileUploadList.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { slide } from "svelte/transition";
  import { MerchantService } from "../../services/merchant-service.js";
  const dispatch = createEventDispatcher();
  let modal,
    model = {
      type: '0',
      userId: null,
      //physical
      firstname: null,
      lastname: null,
      card: {
        id: null,
        userId: null,
        physicalEntityId: null,
        cnp: null,
        series: null,
        nr: null,
        issuer: null,
        expiryDate: null
      },
      //juridical
      name: null,
      cui: null,
      recom: null
    },
    settings;
  $: submitEnabled = notEmptyRequirement(model.title);
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  async function submit() {
    if (!model.title || model.title.length === 0) return;
    modal.toggleLoading();
    // const guid = Utils.create_UUID();
    // if (model.image) {
    //   await FirebaseAPI.uploadFile("items", model.image, guid);
    // }
    // const newItem = await FirebaseAPI.add("items", {
    //   id: guid,
    //   creationDate: new Date().toISOString(),
    //   value: model.title,
    //   image: model.image !== undefined && model.image !== null
    // });
    const formData = new FormData();
    if (model.debtGuaranteeProof && model.debtGuaranteeProof.length > 0) {
      for (let i = 0; i < model.debtGuaranteeProof.length; i++) {
        formData.append("files[]", model.debtGuaranteeProof[i]);
      }
    }
    model.debtGuaranteeProof = null;
    formData.set(
      "productRaw",
      JSON.stringify(model, (key, value) => {
        if (value !== null) return value;
      })
    );
    try {
      const newProduct = await MerchantService.addProduct(formData);
      console.log(newProduct);
      dispatch("submit", newProduct);
    } catch (error) {
      console.log(error);
    }
    modal.toggleLoading();
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
    padding: 0.5em;
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
    align-self: flex-start;
    width: min-content;
  }
  input {
    margin: 0;
    flex-grow: 1;
  }
  input[type="checkbox"] {
    cursor: pointer;
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
  .radio-buttons {
    display: flex;
    justify-content: space-evenly;
    flex-grow: 1;
  }
  .radio-buttons label {
    cursor: pointer;
    margin: 0;
  }
  .radio-buttons label span {
    user-select: none;
  }
  .radio-buttons input {
    cursor: pointer;
    height: 100%;
    margin-right: 0.2em;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <div class="div-label">
      <span class="label-text">
        Type
        <span class="required">*</span>
      </span>
      <div class="radio-buttons">
        <label>
          <input
            type="radio"
            name="type"
            bind:group={model.type}
            value="0"
            checked />
          <span>Physical</span>
        </label>
        <label>
          <input type="radio" name="type" bind:group={model.type} value="1" />
          <span>Juridical</span>
        </label>
      </div>
    </div>
    {#if model.type === '0'}
      <label>
        <span class="label-text">
          First Name
          <span class="required">*</span>
        </span>
        <input
          type="text"
          bind:value={model.firstname}
          on:input={notEmptyRequirement(model.firstname)} />
      </label>
      <label>
        <span class="label-text">
          Last Name
          <span class="required">*</span>
        </span>
        <input
          type="text"
          bind:value={model.lastname}
          on:input={notEmptyRequirement(model.lastname)} />
      </label>
    {:else}
      <label>
        <span class="label-text">
          Name
          <span class="required">*</span>
        </span>
        <input
          type="text"
          bind:value={model.name}
          on:input={notEmptyRequirement(model.name)} />
      </label>
      <label>
        <span class="label-text">
          CUI
          <span class="required">*</span>
        </span>
        <input
          type="text"
          bind:value={model.cui}
          on:input={notEmptyRequirement(model.cui)} />
      </label>
      <label>
        <span class="label-text">
          RECOM
          <span class="required">*</span>
        </span>
        <input
          type="text"
          bind:value={model.cui}
          on:input={notEmptyRequirement(model.recom)} />
      </label>
    {/if}
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
