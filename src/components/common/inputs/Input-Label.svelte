<script>
  import TooltipHelp from "../TooltipHelp.svelte";
  import { _ } from "../../../i18n";
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
  {$_(`${label}.label`)}
  {#if !required}
    <span>({$_('label.optional')})</span>
  {/if}
  {#if helpMessage}
    <TooltipHelp message={helpMessage} />
  {/if}
</label>
