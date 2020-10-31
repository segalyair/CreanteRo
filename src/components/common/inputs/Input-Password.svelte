<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import InputLabel from "./Input-Label.svelte";

  export let id, name, required, label;
  let input;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${label} is required`);
    } else if (input.value.length < 6) {
      dispatch("error", `${label} must be at least 6 characters`);
    } else {
      dispatch("valid", input.value);
    }
  }
  onMount(() => {
    input.id = id;
    input.name = name;
    input.required = required;
    input.onblur = () => {
      dispatch("dirty");
    };
    input.oninput = () => {
      validate();
    };
  });
</script>

<style>
  input {
    width: 300px;
    margin: 0;
    transition: all 200ms;
  }
  input.confirmError,
  input.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
</style>

<input type="password" minlength="6" bind:this={input} class={$$props.class} />
