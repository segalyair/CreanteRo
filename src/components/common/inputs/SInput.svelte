<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import InputEmail from "./Input-Email.svelte";
  import InputText from "./Input-Text.svelte";
  import InputTextarea from "./Input-Textarea.svelte";
  import InputNumber from "./Input-Number.svelte";
  import InputLabel from "./Input-Label.svelte";
  import InputPassword from "./Input-Password.svelte";
  import InputDate from "./Input-Date.svelte";
  import InputFileUpload from "./Input-FileUpload.svelte";
  const dispatch = createEventDispatcher();
  export let type,
    id,
    name,
    label,
    required,
    showPreview = true,
    displayFileName = true,
    uploadLabel = "Choose File",
    multiple = false,
    pattern = null,
    minlength = 0,
    maxlength = 524288,
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
  <InputLabel {name} {label} {required} />
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
      {pattern}
      {minlength}
      {maxlength}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {:else if type === 'textarea'}
    <InputTextarea
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      {pattern}
      {minlength}
      {maxlength}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {:else if type === 'number'}
    <InputNumber
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      {pattern}
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
  {:else if type === 'date'}
    <InputDate
      bind:this={input}
      {id}
      {name}
      {required}
      {label}
      class={hasErrors ? 'error' : ''}
      on:error={e => (errors = [e.detail])}
      on:valid={e => validInput(e.detail)}
      on:dirty={() => (isDirty = true)} />
  {:else if type === 'file'}
    <InputFileUpload
      {id}
      {name}
      {required}
      {label}
      {showPreview}
      {displayFileName}
      {uploadLabel}
      {multiple}
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
