<script>
  import EntityTable from "../components/tables/EntityTable.svelte";
</script>

<style>
  .container {
    padding: 50px 100px 50px 100px;
    width: fit-content;
    border: 1px solid lightgray;
    border-radius: 12px;
    background-color: white;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
  }
</style>

<div class="container">
  <label>Debtor</label>
  <EntityTable />
</div>
