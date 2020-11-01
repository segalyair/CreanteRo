<script>
  export let name, label, required;
</script>

<style>
  span {
    font-size: 0.7em;
  }
</style>

<label for={name}>
  {label}
  {#if !required}
    <span>(Optional)</span>
  {/if}
</label>
