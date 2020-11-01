<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
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
  let chooseFileButton;
  let input;
  let preparedFile = null;
  let previewContainer;
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${label} is required`);
      removePreview();
    } else {
      input.setCustomValidity("");
      fileChange();
    }
  }
  function fileChange(event) {
    const files = input.files;
    if (files.length === 0) {
      return;
    }
    if (type === "img") {
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
    } else {
      dispatch("valid", { files });
    }
  }
  function removePreview() {
    const preview = previewContainer.firstChild;
    if (preview) {
      preview.remove();
    }
    previewContainer.style.display = "none";
  }
  onMount(() => {
    chooseFileButton.onclick = () => {
      input.click();
    };
    input.multiple = multiple;
    input.oninput = () => {
      dispatch("dirty");
      validate();
    };
  });
</script>

<style>
  input {
    display: none;
  }
  .upload-button {
    width: 100%;
  }
  .preview-container {
    margin-top: 10px;
    display: none;
    justify-content: center;
    max-width: 300px;
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
    accept="image/*" />
  {#if showPreview}
    <div class="preview-container" bind:this={previewContainer} />
  {/if}
</div>
