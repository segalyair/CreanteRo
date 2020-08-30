<script>
  let representatives = [{ name: "Test", type: "Juridical" }];
</script>

<style>

</style>

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Actions</th>
  </tr>
  {#each representatives as rep}
    <tr>
      <td>{rep.name}</td>
      <td>{rep.type}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    </tr>
  {/each}
</table>
