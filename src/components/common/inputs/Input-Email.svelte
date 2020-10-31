<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let id, name, label, required;
  let input;
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing || !pattern.test(input.value)) {
      dispatch("error", `${label} is invalid`);
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
  input.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
</style>

<input type="email" bind:this={input} class={$$props.class} />
