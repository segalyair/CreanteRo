<script>
  import Modal from "../../components/common/Modal.svelte";
  import { MarketService } from "../../services/market-service.js";
  import { createEventDispatcher } from "svelte";
  import { current_user } from "../../store.js";
  import EntityTable from "../../components/tables/EntityTable.svelte";
  import { Utils } from "../../utils.js";
  import { _ } from "../../i18n";
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
    try {
      const buyParams = {
        buyerId: $current_user.id,
        buyerRepId: selectedRep ? selectedRep.id : null,
        productId: settings.product.id
      };
      const result = await MarketService.issueBuy(buyParams);
      await Utils.download(result, `${settings.product.title}.docx`);
      dispatch("submit");
      close();
    } catch (err) {
      console.log(err);
    }
  }
</script>

<style>

</style>

<Modal bind:this={modal} on:close={() => close(true)}>
  <div slot="content">
    <!-- <EntityTable
      selectable={true}
      on:select={e => (selectedRep = e.detail.selectedEntity)} /> -->
    <!-- Other purchase stuff goes here (conditions, Stripe, signature etc.) -->
  </div>
  <div slot="actions">
    <button
      class="primary"
      disabled={!submitEnabled}
      on:click={submit}
      type="button">
      {$_('issueBuy.buy')}
    </button>
    <button on:click={() => close(false)} type="button">
      {$_('issueBuy.cancel')}
    </button>
  </div>
</Modal>
