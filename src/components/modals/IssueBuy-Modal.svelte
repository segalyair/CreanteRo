<script>
  import Modal from "../../components/common/Modal.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { createEventDispatcher } from "svelte";
  import { current_user } from "../../store.js";
  import EntityTable from "../../components/tables/EntityTable.svelte";
  const dispatch = createEventDispatcher();
  let modal,
    settings,
    selectedRep = null,
    submitEnabled = true;
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
  async function submit() {
    if (!submitEnabled) return;
    const buyParams = {
      buyerId: $current_user.id,
      buyerRepId: selectedRep ? selectedRep.id : null,
      productId: settings.product.id
    };
    const result = await MarketService.issueBuy(buyParams),
      blob = await result.blob(),
      url = window.URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${settings.product.title}.docx`);
    document.body.appendChild(link);
    link.click();
    dispatch("submit");
    close();
  }
</script>

<style>

</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div slot="content">
    <EntityTable
      selectable={true}
      on:select={e => (selectedRep = e.detail.selectedEntity)} />
    <!-- Other purchase stuff goes here (conditions, Stripe, signature etc.) -->
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Buy</button>
    <button on:click={() => close(false)}>Cancel</button>
  </div>
</Modal>
