<script>
  import Modal from "../../components/common/Modal.svelte";
  import FileUpload from "../common/FileUpload.svelte";
  import FileUploadList from "../common/FileUploadList.svelte";
  import RepresentativeTable from "../../components/tables/RepresentativeTable.svelte";
  import SellProductForm from "../forms/SellProduct-Form.svelte";
  import { Utils } from "../../utils.js";
  import { createEventDispatcher } from "svelte";
  import { FirebaseAPI } from "../../firebase/firebase-api.js";
  import { slide } from "svelte/transition";
  import { MerchantService } from "../../services/merchant-service.js";
  import { current_user } from "../../store.js";
  const dispatch = createEventDispatcher();
  let modal,
    submitEnabled = true,
    model,
    settings;
  export function open(data) {
    modal.open(data);
    settings = data;
  }
  async function submit() {
    if (!model.title || model.title.length === 0) return;
    modal.toggleLoading();
    // const guid = Utils.create_UUID();
    // if (model.image) {
    //   await FirebaseAPI.uploadFile("items", model.image, guid);
    // }
    // const newItem = await FirebaseAPI.add("items", {
    //   id: guid,
    //   creationDate: new Date().toISOString(),
    //   value: model.title,
    //   image: model.image !== undefined && model.image !== null
    // });
    const formData = new FormData();
    if (model.debtGuaranteeProof && model.debtGuaranteeProof.length > 0) {
      for (let i = 0; i < model.debtGuaranteeProof.length; i++) {
        formData.append("files[]", model.debtGuaranteeProof[i]);
      }
    } 
    model.debtGuaranteeProof = null;
    model.isDebtorSolvent = Number(model.isDebtorSolvent);
    formData.set(
      "productRaw",
      JSON.stringify(model)
    );
    try {
      const newProduct = await MerchantService.addProduct(formData);
      console.log(newProduct);
      dispatch("submit", newProduct);
    } catch (error) {
      console.log(error);
    }
    modal.toggleLoading();
    close();
  }
  function close() {
    modal.close();
    Utils.afterDOMRender(() => {
      model = {};
    });
    dispatch("close");
  }
  function notEmptyRequirement(value) {
    return value && value.length > 0;
  }
</script>

<style>
  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 45vw;
    padding: 0.5em;
  }
</style>

<Modal bind:this={modal}>
  <div slot="content" class="form">
    <SellProductForm bind:model />
  </div>
  <div slot="actions">
    <button disabled={!submitEnabled} on:click={submit}>Submit</button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
