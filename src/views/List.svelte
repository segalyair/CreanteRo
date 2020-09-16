<script>
  import { fly } from "svelte/transition";
  import Grid from "../components/common/Grid.svelte";
  import ProductPreview from "../components/ProductPreview.svelte";
  import { selected_product } from "../store.js";
</script>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>

<div class="container">
  <Grid />
  <ProductPreview />
</div>
