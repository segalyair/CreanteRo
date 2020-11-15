<script>
  import Modal from "../../components/common/Modal.svelte";
  import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let modal, settings;
  $: imgSrc = settings ? settings.src : "logo200.png";
  export function changeSettings(data) {
    settings = data;
  }
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  function close(fromModal) {
    if (!fromModal) {
      modal.close();
    }
    dispatch("close");
  }
  function change(e, by) {
    e.preventDefault();
    e.stopPropagation();
    dispatch("change", by);
  }
</script>

<style>
  .content {
    display: flex;
  }
  img {
    user-select: none;
  }
  .icon-container {
    position: absolute;
    z-index: 10;
    background-color: white;
    border-radius: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    cursor: pointer;
  }
  .left {
    left: 30px;
  }
  .right {
    right: 30px;
  }
</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div class="content" slot="content">
    <img src={imgSrc} alt="full" />
  </div>
  <div slot="background">
    {#if settings.current > 0}
      <div class="icon-container left" on:click={e => change(e, -1)}>
        <ChevronLeftIcon size="70" />
      </div>
    {/if}
    {#if settings.current < settings.length - 1}
      <div class="icon-container right" on:click={e => change(e, 1)}>
        <ChevronRightIcon size="70" />
      </div>
    {/if}
  </div>
</Modal>
