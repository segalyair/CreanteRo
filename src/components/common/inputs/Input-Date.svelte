<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let id, name, required, label;
  let input;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${label} is required`);
    } else {
      dispatch("valid", input.value);
    }
  }
  onMount(() => {
    // input.id = id;
    input.name = name;
    input.required = required;
    input.min = new Date().toISOString().split("T")[0];
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
  input.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
</style>

<input type="date" bind:this={input} class={$$props.class} />
