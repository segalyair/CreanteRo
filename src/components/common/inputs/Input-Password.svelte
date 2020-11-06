<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import InputLabel from "./Input-Label.svelte";
  import { _ } from "../../../i18n";
  export let id, name, required, label;
  let input;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", $_(`${label}.error.isRequired`));
    } else if (input.value.length < 6) {
      dispatch("error", $_(`${label}.error.atLeast6Characters`));
    } else {
      dispatch("valid", input.value);
    }
  }
  onMount(() => {
    // input.id = id;
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
    width: 100%;
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
