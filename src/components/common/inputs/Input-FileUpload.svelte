<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { XIcon } from "svelte-feather-icons";
  export let id,
    name,
    required,
    label,
    showPreview = true,
    displayFileName = true,
    uploadLabel = "Choose File",
    multiple = false,
    type = "img";
  const dispatch = createEventDispatcher();
  let chooseFileButton,
    input,
    files = [],
    previewContainer;
  let preparedFile = null;
  function validate() {
    if (input.validity.valueMissing) {
      input.setCustomValidity(`${label} is required`);
      input.checkValidity();
      dispatch("error", `${label} is required`);
      if (multiple === false) {
        removePreview();
      }
    } else {
      input.setCustomValidity("");
      fileChange();
    }
  }
  function fileChange(event) {
    dispatch("valid", input["realFiles"]);
    if (files.length === 0) {
      return;
    }
    if (type === "img" && multiple === false) {
      const file = files[0];
      const maxFileSize = 5; //MB
      const fileSizeInMb = file.size / 1024 / 1024;
      if (fileSizeInMb >= maxFileSize) {
        return;
      }
      const image = new Image();
      image.style.border = "1px solid lightgray";
      image.style.borderRadius = "4px";
      image.onload = () => {
        preparedFile = file;
        if (showPreview) {
          removePreview();
          image.style.maxWidth = "100%";
          image.style.maxHeight = "100%";
          previewContainer.appendChild(image);
          previewContainer.style.display = "flex";
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const scale = 0.5;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          dispatch("valid", { file, blob });
        });
      };
      image.onerror = () => {
        console.log(`'${file.name}' is not an image file`);
      };
      const url = window.URL || window.webkitURL;
      image.src = url.createObjectURL(file);
    }
  }
  function removePreview() {
    const preview = previewContainer.firstChild;
    if (preview) {
      preview.remove();
    }
    previewContainer.style.display = "none";
  }
  function add(event) {
    files = [...files, ...event.target.files];
    input["realFiles"] = files;
    validate();
  }
  function remove(i) {
    if (files && files.length > 0) {
      files.splice(i, 1);
      files = files;
      input["realFiles"] = files;
      if (files.length === 0) {
        input.value = "";
      }
    }
    validate();
  }
  onMount(() => {
    chooseFileButton.onclick = () => {
      dispatch("dirty");
      input.click();
    };
    input.multiple = multiple;
    input.oninput = () => {
      validate();
    };
  });
</script>

<style>
  input {
    display: none;
  }
  .upload-button {
    width: 300px;
  }
  .preview-container {
    margin-top: 10px;
    display: none;
    justify-content: center;
    max-width: 300px;
  }
  .file-list {
    /* display: flex;
    flex-direction: column; */
    width: 300px;
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
  <button class="upload-button" bind:this={chooseFileButton} type="button">
    {uploadLabel}
  </button>
  {#if displayFileName}
    <span>{preparedFile ? preparedFile.name : 'No file uploaded'}</span>
  {/if}
  <input
    bind:this={input}
    {id}
    {name}
    {required}
    type="file"
    accept="image/*"
    on:change={event => add(event)} />
  {#if showPreview}
    <div class="preview-container" bind:this={previewContainer} />
  {/if}
  {#if multiple}
    <div class="file-list">
      {#if files && files.length > 0}
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
  {/if}
</div>
