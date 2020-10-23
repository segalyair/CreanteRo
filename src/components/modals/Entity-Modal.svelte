<script>
  import Modal from "../../components/common/Modal.svelte";
  import FileUpload from "../common/FileUpload.svelte";
  import FileUploadList from "../common/FileUploadList.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { slide } from "svelte/transition";
  import { RepresentativeService } from "../../services/legalSubject-service.js";
  import { current_user } from "../../store.js";
  const dispatch = createEventDispatcher();
  const modelTemplate = {
    id: 0,
    type: "0",
    userId: null,
    address: null,
    //physical
    firstname: null,
    lastname: null,
    card: {
      id: 0,
      userId: null,
      physicalEntityId: 0,
      cnp: null,
      series: null,
      number: null,
      identityIssuer: null,
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
      ? ["id", "userId", "name", "cui", "recom"]
      : ["id", "userId", "firstname", "lastname", "card"];
  $: submitEnabled =
    anyFieldEmpty(model, modelTemplate, ignoreFields) &&
    (model.type === "1" || anyFieldEmpty(model.card, null, cardIgnoreFields));
  export function open(data) {
    modal.open(data);
    if (data.entity) {
      model = data.entity;
    } else {
      model = modelTemplate;
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
    model.userId = $current_user.id;
    try {
      if (!model.id) {
        const entParams = {
          type: Number(model.type),
          userId: $current_user.id,
          rawEntity: JSON.stringify(model),
          rawCard: JSON.stringify(model.card)
        };
        await RepresentativeService.add(entParams);
      } else {
        await RepresentativeService.update(model);
      }
      dispatch("submit");
    } catch (ex) {
      console.log(ex);
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
    width: 30vw;
    height: 45vh;
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
          Number
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.number} />
      </label>
      <label>
        <span class="label-text">
          Issuer
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.card.identityIssuer} />
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
