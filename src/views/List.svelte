<script>
  import Grid from "../components/common/Grid.svelte";
  import ProductPreview from "../components/ProductPreview.svelte";
  import { selected_product } from "../store.js";
  let selected_product_value = null;
  const unsubscribe = selected_product.subscribe(value => {
    selected_product_value = value;
  });
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
  {#if selected_product_value !== null}
    <ProductPreview />
  {/if}
</div>
