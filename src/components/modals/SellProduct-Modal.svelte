<script>
  import Modal from "../../components/common/Modal.svelte";
  import Toast from "../../components/common/Toast.svelte";
  import SellProductForm from "../forms/SellProduct-Form.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { MerchantService } from "../../services/merchant-service.js";
  import { current_user } from "../../store.js";
  const dispatch = createEventDispatcher();
  let modal,
    form,
    toast,
    debtor,
    submitEnabled = false,
    settings;
  function isValid(e) {
    submitEnabled = e.detail;
  }
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  async function submit() {
    modal.toggleLoading();
    try {
      const formData = new FormData(),
        data = Utils.formToJSON(form);
      formData.set(
        "postingRaw",
        JSON.stringify({
          debtorId: debtor.selectedEntity.id,
          sellerRepId: null,
          quality: null
        })
      );
      formData.set(
        "productRaw",
        JSON.stringify({
          merchantId: $current_user.id,
          title: data.title,
          bookValueAmount: Number(data.bookValueAmount),
          priceAmount: Number(data.priceAmount),
          currency: "RON"
        })
      );
      let photoIndex = 0,
        pdfIndex = 0;
      for (let file of Array.from(form.documents.realFiles)) {
        let fileName = "document_";
        if (file["type"].split("/")[0] === "image") {
          photoIndex++;
          fileName += `photo${photoIndex}`;
        } else {
          pdfIndex++;
          fileName += `pdf${pdfIndex}`;
        }
        formData.append("documents", file, fileName);
      }
      if (form.otherDocuments.realFiles) {
        let otherDocumentIndex = 0;

        for (let file of Array.from(form.otherDocuments.realFiles)) {
          let fileName = `otherDocument_${file.name}`;
          formData.append("documents", file, fileName);
        }
      }
      const newProduct = await MerchantService.addProduct(formData);
      toast.create(`Product created successfully`, 3000);
      dispatch("submit", newProduct);
    } catch (error) {
      console.log(error);
    }
    modal.toggleLoading();
    close();
  }
  function close() {
    modal.close();
    submitEnabled = false;
    dispatch("close");
  }
</script>

<style>
  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 65vw;
    padding: 0.5em;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <SellProductForm
      on:mount={e => (form = e.detail)}
      on:debtor={e => (debtor = e.detail)}
      on:input={isValid} />
  </div>
  <div slot="actions">
    <button
      disabled={!submitEnabled || !debtor || !debtor.selectedEntity}
      on:click={submit}
      type="button">
      Submit
    </button>
    <button on:click={close} type="button">Cancel</button>
  </div>
</Modal>
<Toast bind:this={toast} />
