<script>
  import { onMount } from "svelte";
  import { UserService } from "../services/user-service.js";
  import { auth } from "../firebase/firebase";
  import { Utils } from "../utils.js";
  import { current_user } from "../store.js";
  import SInput from "../components/common/inputs/SInput.svelte";
  import LoadingSpinner from "../Components/Common/LoadingSpinner.svelte";
  import Toast from "../components/common/Toast.svelte";
  let isLoading = false,
    form,
    toast,
    canRegister,
    passwordErrors = [];
  function passwordValidate() {
    const passwordsNotEqual =
      form && form.elements.password.value !== form.confirmPassword.value;
    if (form.checkValidity() && passwordsNotEqual) {
      passwordErrors = ["Password and Confirm Password has to match"];
    } else {
      passwordErrors = [];
    }
  }
  async function register() {
    isLoading = true;
    try {
      const formData = new FormData();
      formData.set("userRaw", Utils.formToJSON(form, true));
      const user = await UserService.register(formData);
      if (user) {
        const userCredential = await auth.signInWithEmailAndPassword(
          form.elements.email.value,
          form.elements.password.value
        );
        current_user.set(await UserService.getById(userCredential.user.uid));
        Utils.redirect("/list");
      }
    } catch (error) {
      toast.create(`Failed to register user`, 3000, "#e46464");
      console.log(error);
    }
    isLoading = false;
  }
  onMount(() => {
    form.elements.password.addEventListener("input", () => {
      passwordValidate();
    });
    form.elements.confirmPassword.addEventListener("input", () => {
      passwordValidate();
    });
    form.addEventListener("input", () => {
      const emailValid = form.elements.email.value.length > 0;
      canRegister = form.checkValidity() && passwordErrors.length === 0;
    });
  });
</script>

<style>
  .register-container {
    display: flex;
    flex-direction: column;
    padding: 50px 100px 50px 100px;
    width: fit-content;
    border: 1px solid lightgray;
    border-radius: 12px;
    background-color: white;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
  }
  .fill-gap {
    flex-grow: 1;
  }
  .container {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sub-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    min-width: 300px;
    height: 100%;
  }
  .register {
    cursor: pointer;
    width: 150px;
    height: 40px;
  }
  .register[disabled] {
    cursor: not-allowed;
  }
</style>

<div class="register-container">
  <div class="fill-gap" />
  <div class="container">
    <div class="sub-container">
      <form bind:this={form} onsubmit="event.preventDefault(); return;">
        <SInput
          type={'email'}
          id={'email'}
          name={'email'}
          label="Email"
          required={true} />
        <SInput
          type={'password'}
          id={'password'}
          name={'password'}
          label="Password"
          required={true}
          on:change={e => passwordValidate()} />
        <SInput
          type={'password'}
          id={'confirmPassword'}
          name={'confirmPassword'}
          label="Confirm Password"
          required={true}
          externalErrors={passwordErrors}
          on:change={e => passwordValidate()} />
        <button class="primary register" disabled={!canRegister} on:click={register}>
          Register
        </button>
      </form>
    </div>
  </div>
  <LoadingSpinner {isLoading} backgroundColor={'rgba(0, 0, 0, 0.05)'} />
</div>
<Toast bind:this={toast} />
