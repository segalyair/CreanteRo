<script>
  import TooltipHelp from "../TooltipHelp.svelte";
  export let name, label, required, helpMessage;
</script>

<style>
  label {
    margin-bottom: 4px;
  }
  span {
    font-size: 0.7em;
  }
</style>

<label for={name}>
  {label}
  {#if !required}
    <span>(Optional)</span>
  {/if}
  {#if helpMessage}
    <TooltipHelp message={helpMessage} />
  {/if}
</label>
