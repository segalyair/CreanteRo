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
      title: null,
      seller: null,
      owedAmount: null,
      priceAmount: null,
      debtGuarantee: false,
      debtGuaranteeProof: null,
      debtGuaranteeDetails: null,
      debtorSolvent: false,
      debtorSolventDetails: null,
      debtor: null,
      isForeclosured: false,
      isForeclosuredDetails: null,
      ownerCanRequestForeclosure: false,
      merchantId: 1
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
    justify-content: space-between;
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
        Owed Amount
        <span class="required">*</span>
      </span>
      <input
        type="number"
        min="1"
        bind:value={model.owedAmount}
        on:input={notEmptyRequirement(model.owedAmount)} />
    </label>
    <label>
      <span class="label-text">Is the debt guaranteed?</span>
      <input type="checkbox" bind:checked={model.debtGuarantee} />
    </label>
    {#if model.debtGuarantee}
      <div class="div-label" transition:slide|local>
        <span class="label-text">
          Guarantee Proof
          <span class="required">*</span>
        </span>
        <FileUploadList
          on:change={e => (model.debtGuaranteeProof = e.detail)} />
      </div>
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
      <div class="radio-buttons">
        <label>
          <input type="radio" name="isDebtorSolvent" value="1" />
          <span>Yes</span>
        </label>
        <label>
          <input type="radio" name="isDebtorSolvent" value="2" />
          <span>No</span>
        </label>
        <label>
          <input type="radio" name="isDebtorSolvent" value="3" />
          <span>I don't know</span>
        </label>
      </div>
    </div>
    <label>
      <span class="label-text">Details</span>
      <textarea bind:value={model.debtorSolventDetails} />
    </label>
    <div class="div-label">
      <span class="label-text">Other documents</span>
      <FileUploadList />
    </div>
    <label>
      <span class="label-text">
        Debtor
        <span class="required">*</span>
      </span>
      <textarea bind:value={model.debtor} />
    </label>
    <label>
      <span class="label-text">Is foreclosured?</span>
      <input type="checkbox" bind:checked={model.isForeclosured} />
    </label>
    {#if model.isForeclosured}
      <div transition:slide|local>
        <label>
          <span class="label-text">
            Details
            <span class="required">*</span>
          </span>
          <textarea bind:value={model.isForeclosuredDetails} />
        </label>
      </div>
    {:else}
      <div transition:slide|local>
        <label>
          <span class="label-text">Can the claimant request foreclosure?</span>
          <input
            type="checkbox"
            bind:checked={model.ownerCanRequestForeclosure} />
        </label>
        {#if !model.ownerCanRequestForeclosure}
          <label transition:slide|local>
            <span class="label-text">
              Why can't the claimant request enforcement?
            </span>
            <input type="checkbox" />
          </label>
        {/if}
      </div>
    {/if}
    <label>
      <span class="label-text">
        Price
        <span class="required">*</span>
      </span>
      <input
        type="number"
        min="1"
        bind:value={model.priceAmount}
        on:input={notEmptyRequirement(model.priceAmount)} />
    </label>
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
