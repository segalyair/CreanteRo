<script>
  import Modal from "../../components/common/Modal.svelte";
  import FileUpload from "../common/FileUpload.svelte";
  import FileUploadList from "../common/FileUploadList.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { slide } from "svelte/transition";
  import { RepresentativeService } from "../../services/representative-service.js";
  const dispatch = createEventDispatcher();
  const modelTemplate = {
    id: null,
    type: "0",
    userId: null,
    address: null,
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
  };
  let modal,
    model = modelTemplate,
    settings,
    cardIgnoreFields = ["id", "userId", "physicalEntityId"];
  $: ignoreFields =
    model.type === "0"
      ? ["userId", "name", "cui", "recom"]
      : ["userId", "firstname", "lastname", "card"];
  $: submitEnabled =
    anyFieldEmpty(model, modelTemplate, ignoreFields) &&
    (model.type === "1" || anyFieldEmpty(model.card, null, cardIgnoreFields));
  export function open(data) {
    modal.open(data);
    if (data.rep) {
      model = data.rep;
    }
    settings = data;
  }
  function anyFieldEmpty(obj, template, ignoreKeys) {
    return (
      Object.keys(template || obj).find(
        k => !ignoreKeys.includes(k) && (!obj[k] || obj[k].length <= 0)
      ) === undefined
    );
  }
  async function submit() {
    if (!submitEnabled) return;
    const formData = new FormData(),
      repRaw = JSON.stringify({
        type: Number(model.type),
        rawEntity: JSON.stringify(model)
      });

    formData.set("repRaw", repRaw);
    if (model.id) {
      await RepresentativeService.add(formData);
    } else {
      await RepresentativeService.update(formData);
    }
    close();
  }
  function close(fromModal) {
    if (!fromModal) {
      modal.close();
    }
    Utils.afterDOMRender(() => {
      model = modelTemplate;
    });
    dispatch("close");
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

<Modal bind:this={modal} on:close={() => close(true)}>
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
        <input type="text" bind:value={model.firstname} />
      </label>
      <label>
        <span class="label-text">
          Last Name
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.lastname} />
      </label>
      <label>
        <span class="label-text">
          CNP
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.cnp} />
      </label>
      <label>
        <span class="label-text">
          Series
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.series} />
      </label>
      <label>
        <span class="label-text">
          Nr
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.nr} />
      </label>
      <label>
        <span class="label-text">
          Issuer
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.issuer} />
      </label>
      <label>
        <span class="label-text">
          Expiry Date
          <span class="required">*</span>
        </span>
        <input type="date" bind:value={model.card.expiryDate} />
      </label>
    {:else}
      <label>
        <span class="label-text">
          Name
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.name} />
      </label>
      <label>
        <span class="label-text">
          CUI
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.cui} />
      </label>
      <label>
        <span class="label-text">
          RECOM
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.recom} />
      </label>
    {/if}
    <label>
      <span class="label-text">
        Address
        <span class="required">*</span>
      </span>
      <textarea bind:value={model.address} />
    </label>
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Submit</button>
    <button on:click={() => close(false)}>Cancel</button>
  </div>
</Modal>
