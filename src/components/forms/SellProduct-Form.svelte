<script>
  import { onMount } from "svelte";
  import EntityTable from "../../components/tables/EntityTable.svelte";
  import TooltipHelp from "../common/TooltipHelp.svelte";
  import SInput from "../../components/common/inputs/SInput.svelte";
  import { createEventDispatcher } from "svelte";
  import { current_user } from "../../store.js";
  export let preview = false;
  const dispatch = createEventDispatcher();
  let form, debtorTable;
  function dispatchDebtorTable(e) {
    dispatch("debtor", e.detail);
  }
  onMount(() => {
    form.addEventListener("input", () => {
      dispatch("input", form.checkValidity());
    });
    dispatch("mount", form);
  });
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
  .label-text {
    margin-right: 10px;
    width: 10vw;
    text-align: right;
    align-self: flex-start;
  }
  .tag {
    text-align: right;
    width: 200px;
  }
  .value {
    flex-grow: 1;
    text-align: center;
  }
</style>

{#if !preview}
  <div class="container">
    <form bind:this={form} onsubmit="event.preventDefault(); return;">
      <SInput
        type={'text'}
        id={'title'}
        name={'title'}
        label="Title"
        required={true} />
      <SInput
        type={'file'}
        id={'documents'}
        name={'documents'}
        label="Documents"
        required={true}
        multiple={true}
        displayFileName={false}
        uploadLabel={'Upload Files'}
        showPreview={false} />
      <SInput
        type={'number'}
        id={'bookValueAmount'}
        name={'bookValueAmount'}
        label="Owed Amount"
        required={true} />
      <SInput
        type={'number'}
        id={'priceAmount'}
        name={'priceAmount'}
        label="Price"
        required={true} />
      <label for="debtor">Debtor</label>
      <EntityTable
        bind:this={debtorTable}
        selectable={true}
        on:select={dispatchDebtorTable} />
      <SInput
        type={'file'}
        id={'otherDocuments'}
        name={'otherDocuments'}
        label="Other Documents"
        required={false}
        multiple={true}
        displayFileName={false}
        uploadLabel={'Upload Files'}
        showPreview={false} />
      <SInput
        type={'textarea'}
        id={'details'}
        name={'details'}
        label="Details"
        required={false} />
    </form>
  </div>
{:else}
  <div class="preview-container">
    <!-- <span class="label-text">
      <span class="tag">Title:</span>
      <span class="value">{model.title}</span>
    </span> -->
    <!-- <div class="div-label">
      <span class="label-text">Representative</span>
      <EntityTable selectable={true} />
    </div> -->
    <!-- <span class="label-text">
      <span class="tag">Owed Amount:</span>
      <span class="value">{model.bookValueAmount}</span>
    </span> -->
    <!-- <span class="label-text">
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
    </span> -->
    <span class="label-text">
      <span class="tag">Other documents</span>
    </span>
    <!-- <span class="label-text">
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
       {#if !model.ownerCanRequestForeclosure}
        <label>
          <span class="label-text">
            Why can't the claimant request enforcement?
          </span>
          <input type="checkbox" />
        </label>
      {/if}
    {/if} -->
    <!-- <span class="label-text">
      <span class="tag">Price:</span>
      <span class="value">{model.priceAmount}</span>
    </span> -->
  </div>
{/if}
