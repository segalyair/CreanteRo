<script>
  import { selected_product } from "../store.js";
  import SellProductForm from "./forms/SellProduct-Form.svelte";
  import { fade } from "svelte/transition";
</script>

<style>
  .container {
    display: flex;
    flex: 1 1 0px;
    height: 100%;
    padding: 10px;
    border: 1px solid lightgray;
    border-radius: 8px;
    text-align: center;
    overflow: auto;
  }
  .container .no-product {
    font-size: 1.5em;
    font-weight: 100;
    justify-self: center;
    align-self: center;
  }
</style>

<div class="container">
  {#if !$selected_product}
    <span class="no-product">
      Alegeti un contract din lista de contracte ca sa vizualizati detaliile
    </span>
  {:else}
    <div style="flex-grow:1" in:fade />
  {/if}
</div>
