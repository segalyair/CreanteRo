<script>
  import { XIcon } from "svelte-feather-icons";
  import { Utils } from "../../utils.js";
  let template;
  let index = 0;
  function fade(toast, value, remove) {
    toast.style.opacity = value;
    if (!remove) return;
    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 200);
  }
  export function create(message, duration, color) {
    const newToast = template.cloneNode(true);
    newToast.classList.add(index++);
    newToast.style.display = "flex";
    const green = "#61b84f";
    newToast.style.backgroundColor = color || green;
    const icon = newToast.getElementsByClassName("icon-container")[0];
    const msg = newToast.getElementsByClassName("message")[0];
    msg.innerHTML = message;
    icon.onclick = () => {
      fade(newToast, "0", true);
    };
    setTimeout(() => {
      fade(newToast, "0", true);
    }, duration);
    document.body.appendChild(newToast);
    Utils.afterDOMRender(() => {
      fade(newToast, "1");
    });
  }
</script>

<style>
  .container {
    position: absolute;
    z-index: 9999;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    bottom: 10px;
    min-width: 200px;
    max-width: 300px;
    min-height: 70px;
    padding: 12px;
    background-color: #61b84f;
    border-radius: 4px;
    display: none;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    -webkit-transition: opacity 200ms linear;
    transition: opacity 200ms linear;
  }
  .message {
    font-size: 1.1em;
    color: white;
  }
  .icon-container {
    line-height: 10px;
    cursor: pointer;
    color: white;
  }
</style>

<div bind:this={template} class="container">
  <span class="message" />
  <div class="icon-container">
    <XIcon size="18" />
  </div>
</div>
