<script>
  import FileUpload from "../common/FileUpload.svelte";
  import FileUploadList from "../common/FileUploadList.svelte";
  import RepresentativeTable from "../../components/tables/RepresentativeTable.svelte";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { current_user } from "../../store.js";
  const dispatch = createEventDispatcher();
  export let preview = false;
  export let model = {
    title: null,
    seller: null,
    bookValueAmount: null,
    priceAmount: null,
    isGuaranteed: false,
    debtGuaranteeProof: null,
    guaranteeDetails: null,
    isDebtorSolvent: 0,
    debtorSolvencyDetails: null,
    debtor: null,
    isForeclosured: false,
    foreclosureDetails: null,
    ownerCanRequestForeclosure: false,
    reasonCannotObtainForeclosure: null,
    isForeclosureContested: false,
    reasonForeclosureNotContested: null,
    merchantId: $current_user.id
  };
  function notEmptyRequirement(value) {
    return value && value.length > 0;
  }
</script>

<style>
  .container {
    flex-grow: 1;
  }
  .preview-container {
    height: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .preview-container .label-text {
    width: 100%;
    text-align: left;
    padding: 6px;
    font-size: 18px;
    display: flex;
  }
  .tag {
    text-align: right;
    width: 200px;
  }
  .value {
    flex-grow: 1;
    text-align: center;
  }
  .required {
    color: red;
    font-size: 22px;
  }
  label {
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
    width: 10vw;
    text-align: right;
    align-self: flex-start;
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

{#if !preview}
  <div class="container">
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
    <div class="div-label">
      <span class="label-text">Representative</span>
      <RepresentativeTable selectable={true} />
    </div>
    <label>
      <span class="label-text">
        Owed Amount
        <span class="required">*</span>
      </span>
      <input
        type="number"
        min="1"
        bind:value={model.bookValueAmount}
        on:input={notEmptyRequirement(model.bookValueAmount)} />
    </label>
    <label>
      <span class="label-text">Is the debt guaranteed?</span>
      <input type="checkbox" bind:checked={model.isGuaranteed} />
    </label>
    {#if model.isGuaranteed}
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
      <textarea bind:value={model.guaranteeDetails} />
    </label>
    <div class="div-label">
      <span class="label-text">
        Is the debtor solvent?
        <span class="required">*</span>
      </span>
      <div class="radio-buttons">
        <label>
          <input
            type="radio"
            name="isDebtorSolvent"
            value="0"
            bind:group={model.isDebtorSolvent} />
          <span>Yes</span>
        </label>
        <label>
          <input
            type="radio"
            name="isDebtorSolvent"
            value="1"
            bind:group={model.isDebtorSolvent} />
          <span>No</span>
        </label>
        <label>
          <input
            type="radio"
            name="isDebtorSolvent"
            value="2"
            bind:group={model.isDebtorSolvent} />
          <span>I don't know</span>
        </label>
      </div>
    </div>
    <label>
      <span class="label-text">Details</span>
      <textarea bind:value={model.debtorSolvencyDetails} />
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
          <textarea bind:value={model.foreclosureDetails} />
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
{:else}
  <div class="preview-container">
    <span class="label-text">
      <span class="tag">Title:</span>
      <span class="value">{model.title}</span>
    </span>
    <!-- <div class="div-label">
      <span class="label-text">Representative</span>
      <RepresentativeTable selectable={true} />
    </div> -->
    <span class="label-text">
      <!-- <span class="label">Owed Amount:</span> -->
      <span class="tag">Owed Amount:</span>
      <span class="value">{model.bookValueAmount}</span>
    </span>
    <span class="label-text">
      <span class="tag">Is the debt guaranteed:</span>
      <span class="value">{model.isGuaranteed ? 'Yes' : 'No'}</span>
    </span>
    {#if model.isGuaranteed}
      <span class="label-text">
        <span class="tag">Guarantee Proof</span>
      </span>
    {/if}
    <span class="label-text">
      <span class="tag">Details:</span>
      <span class="value">{model.guaranteeDetails}</span>
    </span>
    <span class="label-text">
      <span class="tag">Is the debtor solvent:</span>
      <span class="value">{model.isDebtorSolvent}</span>
    </span>
    <span class="label-text">
      <span class="tag">Details:</span>
      <span class="value">{model.debtorSolvencyDetails}</span>
    </span>
    <span class="label-text">
      <span class="tag">Other documents</span>
    </span>
    <span class="label-text">
      <span class="tag">Debtor:</span>
      <span class="value">{model.debtor}</span>
    </span>
    <span class="label-text">
      <span class="tag">Is foreclosured:</span>
      <span class="value">{model.isForeclosured ? 'Yes' : 'No'}</span>
    </span>
    {#if model.isForeclosured}
      <span class="label-text">
        <span class="tag">Details:</span>
        <span class="value">{model.foreclosureDetails}</span>
      </span>
    {:else}
      <span class="label-text">
        <span class="tag">Can the claimant request foreclosure:</span>
        <span class="value">
          {model.ownerCanRequestForeclosure ? 'Yes' : 'No'}
        </span>
      </span>
      <!-- {#if !model.ownerCanRequestForeclosure}
        <label>
          <span class="label-text">
            Why can't the claimant request enforcement?
          </span>
          <input type="checkbox" />
        </label>
      {/if} -->
    {/if}
    <span class="label-text">
      <span class="tag">Price:</span>
      <span class="value">{model.priceAmount}</span>
    </span>
  </div>
{/if}
