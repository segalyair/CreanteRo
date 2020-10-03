<script>
  import Modal from "../../components/common/Modal.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { createEventDispatcher } from "svelte";
  import { current_user } from "../../store.js";
  import RepresentativeTable from "../../components/tables/RepresentativeTable.svelte";
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
    const formData = new FormData();
    formData.set(
      "buyParamsRaw",
      JSON.stringify({
        buyerId: $current_user.id,
        buyerRepId: selectedRep.id,
        productId: settings.product.id
      })
    );
    const result = await MarketService.issueBuy(formData);
    dispatch("submit");
    close();
  }
</script>

<style>

</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div slot="content">
    <RepresentativeTable
      selectable={true}
      on:select={e => (selectedRep = e.detail.selectedRep)} />
    Other purchase stuff goes here (conditions, Stripe, signature etc.)
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Buy</button>
    <button on:click={() => close(false)}>Cancel</button>
  </div>
</Modal>
