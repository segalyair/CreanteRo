<script>
  import Grid from "../components/common/Grid.svelte";
  import ProductPreview from "../components/ProductPreview.svelte";
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
  <ProductPreview />
</div>
