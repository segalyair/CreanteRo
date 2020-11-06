<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let id,
    name,
    required,
    label,
    pattern,
    minlength = 0,
    maxlength = 524288;
  let input;
  const dispatch = createEventDispatcher();
  function validate() {
    if (input.validity.valueMissing) {
      dispatch("error", `${label} is required`);
    } else if (
      input.validity.tooShort ||
      (pattern && !pattern.test(input.value))
    ) {
      input.setCustomValidity(`${label} is not valid`);
      dispatch("error", `${label} is not valid`);
    } else {
      input.setCustomValidity("");
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
  textarea {
    width: 100%;
    height: 150px;
    margin: 0;
  }
  textarea.error {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.025);
  }
</style>

<textarea
  type="text"
  bind:this={input}
  class={$$props.class}
  {minlength}
  {maxlength} />
