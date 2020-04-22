<script>
  import { XIcon } from "svelte-feather-icons";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Spinner from "svelte-spinner";
  import Toast from "./Toast.svelte";
  let toast;
  const dispatch = createEventDispatcher();
  let visible = false;
  let loading = false;
  let title, actions, data, toastMessage;
  export function openModal(settings) {
    title = settings.title;
    actions = settings.actions;
    data = settings.data;
    toastMessage = settings.toastMessage;
    visible = true;
  }
  export function getData() {
    return data;
  }
  export function setActionActive(value, active) {
    const action = actions.find(a => a.value === value);
    if (action) {
      action.element.disabled = !active;
    }
  }
  function closeModal(completedCallback) {
    if (loading) {
      return;
    }
    dispatch("close");
    visible = false;
    if (completedCallback === true && toastMessage) {
      toast.create(toastMessage, 3000);
    }
  }
  async function executeAction(callback) {
    if (callback) {
      window.getSelection().removeAllRanges();
      loading = true;
      await callback();
      loading = false;
    }
    closeModal(!!callback);
  }
</script>

<style>
  .transition {
    position: relative;
    z-index: 1;
  }
  .container {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .spinner-container {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .spinner {
    margin: auto;
  }
  .slot {
    flex-grow: 1;
  }
  .modal {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 150px;
    min-height: 150px;
    width: auto;
    height: auto;
    background-color: white;
    border-radius: 4px;
    padding: 10px;
  }
  .modal-title {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    user-select: none;
  }
  .icon-container {
    cursor: pointer;
    margin-left: 5px;
  }
  .actions {
    display: flex;
    justify-content: center;
  }
  .actions button {
    margin: 0 6px 0 6px;
  }
</style>

<Toast bind:this={toast} />
{#if visible}
  <div class="transition" transition:fade={{ duration: 200 }}>
    <div
      class="container"
      style="pointer-events:{loading ? 'none' : 'auto'};user-select:{loading ? 'none' : 'auto'}"
      on:click={closeModal}>
      <div class="modal" on:click|stopPropagation>
        {#if loading}
          <div transition:fade={{ duration: 200 }}>
            <div class="spinner-container">
              <div class="spinner">
                <Spinner
                  size="85"
                  speed="650"
                  color="#ff3e00"
                  thickness="3"
                  gap="40" />
              </div>
            </div>
          </div>
        {/if}
        <div class="modal-title">
          <h2>{title}</h2>
          <div class="icon-container" on:click={closeModal}>
            <XIcon size="18" />
          </div>
        </div>
        <div class="slot">
          <slot />
        </div>
        {#if actions && actions.length > 0}
          <div class="actions">
            {#each actions as action}
              <button
                bind:this={action.element}
                disabled={action.disabled}
                on:click={executeAction(action.callback)}>
                {action.value}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
