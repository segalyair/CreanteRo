<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  export let showPreview = true,
    displayFileName = true,
    uploadLabel = "Choose File",
    multiple = false,
    type = "img";
  const dispatch = createEventDispatcher();
  let chooseFileButton;
  let uploadInput;
  let preparedFile = null;
  let previewContainer;
  onMount(() => {
    chooseFileButton.onclick = () => {
      uploadInput.click();
    };
    uploadInput.multiple = multiple;
  });
  function fileChange(event) {
    const files = event.target.files;
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
      image.onload = () => {
        preparedFile = file;
        if (showPreview) {
          removePreview();
          image.style.maxWidth = "100%";
          image.style.maxHeight = "100%";
          previewContainer.appendChild(image);
          previewContainer.style.display = "block";
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const scale = 0.5;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          dispatch("file", { file, blob });
        });
      };
      image.onerror = () => {
        console.log(`'${file.name}' is not an image file`);
      };
      const url = window.URL || window.webkitURL;
      image.src = url.createObjectURL(file);
    } else {
      dispatch("file", { files });
    }
  }
  function removePreview() {
    const preview = previewContainer.firstChild;
    if (preview) {
      preview.remove();
    }
    previewContainer.style.display = "none";
  }
</script>

<style>
  input {
    display: none;
  }
  .upload-button {
    width: 100%;
  }
  .preview-container {
    display: none;
    width: 250px;
    height: 250px;
  }
</style>

<div class="container">
  <button class="upload-button" bind:this={chooseFileButton}>
    {uploadLabel}
  </button>
  {#if displayFileName}
    <span>{preparedFile ? preparedFile.name : 'No file uploaded'}</span>
  {/if}
  <input
    type="file"
    bind:this={uploadInput}
    on:change={fileChange}
    accept="image/*" />
  {#if showPreview}
    <div class="preview-container" bind:this={previewContainer} />
  {/if}
</div>
