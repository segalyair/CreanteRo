<script>
  import { XIcon } from "svelte-feather-icons";
  import FileUpload from "../common/inputs/Input-FileUpload.svelte";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let files = [];
  $: hasFiles = files && files.length > 0;
  function add(event) {
    files = [...files, ...event.detail.files];
    dispatch("change", files);
  }
  function remove(i) {
    if (hasFiles) {
      files.splice(i, 1);
      files = files;
      dispatch("change", files);
    }
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  .file-list {
    display: flex;
    flex-direction: column;
  }
  .file:not(:first-child) {
    border-top: 0;
  }
  .file {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0.4em;
  }
  .file span {
    overflow-wrap: anywhere;
  }
  .icon-container {
    cursor: pointer;
    margin-left: 5px;
  }
</style>

<div class="container">
  <FileUpload
    showPreview={false}
    displayFileName={false}
    uploadLabel={'Upload Files'}
    multiple={true}
    type={'other'}
    on:file={event => add(event)} />
  <div class="file-list">
    {#if hasFiles}
      {#each files as file, i}
        <div class="file">
          <span>{file.name}</span>
          <div class="icon-container" on:click={event => remove(i)}>
            <XIcon size="18" />
          </div>
        </div>
      {/each}
    {:else}
      <div class="file file-empty">
        <span>No files uploaded</span>
        <div />
      </div>
    {/if}
  </div>
</div>
