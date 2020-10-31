<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import InputEmail from "./Input-Email.svelte";
  import InputText from "./Input-Text.svelte";
  import InputLabel from "./Input-Label.svelte";
  import InputPassword from "./Input-Password.svelte";
  const dispatch = createEventDispatcher();
  export let type,
    id,
    name,
    label,
    required,
    externalErrors = [];
  let input,
    isDirty = false,
    errors = [];
  $: hasErrors = (errors.length > 0 || externalErrors.length > 0) && isDirty;
  function validInput(value) {
    errors = [];
  }
  onMount(() => {});
</script>

<style>
  .container {
    margin: 10px 0;
  }
  .error {
    color: red;
    font-size: 0.8em;
  }
</style>

<div class="container">
  <InputLabel {name} {label} />
  {#if type === 'email'}
    <InputEmail
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {:else if type === 'text'}
    <InputText
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {:else if type === 'password'}
    <InputPassword
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {/if}
  {#if hasErrors}
    <div transition:slide>
      {#each errors as error}
        <p class="error">{error}</p>
      {/each}
      {#each externalErrors as error}
        <p class="error">{error}</p>
      {/each}
    </div>
  {/if}
</div>
