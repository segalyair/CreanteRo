<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { _ } from "../../../i18n";
  
  export let id, name, required, label;
  let input, overlayInput;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${$_(label + ".error.isRequired")}`);
      overlayInput.value = null;
    } else {
      dispatch("valid", input.value);
      overlayInput.value = input.value
        .split("-")
        .reverse()
        .join("/");
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
    input.value = "";
  });
</script>

<style>
  .container {
    position: relative;
  }
  input[type="date"] {
    outline: none;
    width: 100%;
    margin: 0;
    transition: all 200ms;
  }
  input[type="date"].error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
  input[type="text"] {
    pointer-events: none;
    height: 100%;
    width: 80%;
    margin: 0;
    color: black;
    background-color: white;
    position: absolute;
    border-right: none;
    top: 0;
    left: 0;
  }
  input[type="text"].error {
    border-color: red;
  }
</style>

<div class="container">
  <input type="date" bind:this={input} class={$$props.class} />
  <input
    type="text"
    bind:this={overlayInput}
    disabled
    placeholder="dd/mm/yyyy"
    class={$$props.class} />
</div>
