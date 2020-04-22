<script>
  import Modal from "../../components/common/Modal.svelte";
  import FileUpload from "./FileUpload.svelte";
  import { Utils } from "../../utils.js";
  let modal, fields;
  let model = {};
  export function openModal(settings) {
    settings.actions = [
      {
        value: "Submit",
        disabled: true,
        callback: async () => {
          await settings.onSubmit(model);
          Utils.afterDOMRender(() => {
            model = {};
          });
        }
      },
      { value: "Cancel" }
    ];
    modal.openModal(settings);
    fields = settings.fields;
  }
  function verifyRequirement(event, required) {
    const result = required(event);
    modal.setActionActive("Submit", result);
  }
</script>

<style>
  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .required {
    color: red;
    font-size: 22px;
  }
</style>

<Modal bind:this={modal}>
  <div class="form">
    {#each fields as field}
      <label>
        {field.label}
        {#if field.required}
          <span class="required">*</span>
        {/if}
        {#if field.type === 'text'}
          <input
            type="text"
            bind:value={model[field.name]}
            on:input={field.required ? event => verifyRequirement(event, field.required) : null} />
        {/if}
        {#if field.type === 'upload'}
          <FileUpload on:file={event => (model[field.name] = event.detail)} />
        {/if}
      </label>
    {/each}
  </div>
</Modal>
