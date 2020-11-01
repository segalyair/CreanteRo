<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let id, name, required, label, pattern;
  let input;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${label} is required`);
    } else if (pattern && !pattern.test(input.value)) {
      input.setCustomValidity(`${label} is not valid`);
      dispatch("error", `${label} is not valid`);
    } else {
      input.setCustomValidity("");
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
  input.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>

<input type="number" bind:this={input} class={$$props.class} />
