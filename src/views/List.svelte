<script>
  import Grid from "../components/common/Grid.svelte";
  import ProductPreview from "../components/ProductPreview.svelte";
  import { selected_product } from "../store.js";
</script>

<style>
  .container {
    display: flex;
    height: 100%;
  }
  .container > div {
    margin-right: 10px;
  }
</style>

<div class="container">
  <Grid />
  {#if $selected_product !== null}
    <ProductPreview />
  {/if}
</div>
