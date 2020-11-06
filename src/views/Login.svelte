<script>
  import { auth } from "../firebase/firebase";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { Utils } from "../utils.js";
  import { current_user } from "../store.js";
  import { UserService } from "../services/user-service.js";
  import { _ } from "../i18n";
  import LoadingSpinner from "../Components/Common/LoadingSpinner.svelte";
  import SInput from "../components/common/inputs/SInput.svelte";
  import Toast from "../components/common/Toast.svelte";
  let form,
    toast,
    canLogin = false,
    isLoading = false;
  async function handleLogin() {
    isLoading = true;
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        form.elements.email.value,
        form.elements.password.value
      );
      current_user.set(await UserService.getById(userCredential.user.uid));
      Utils.redirect("/list");
    } catch (error) {
      toast.create(`Failed to login`, 3000, "#e46464");
      console.log(error);
    }
    isLoading = false;
  }

  onMount(() => {
    form.addEventListener("input", () => {
      const emailValid = form.elements.email.value.length > 0;
      const passwordValid = form.elements.password.value.length > 5;
      canLogin = emailValid && passwordValid;
    });
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 100px 50px 100px;
    width: fit-content;
    border: 1px solid lightgray;
    border-radius: 12px;
    background-color: white;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
  }
  .actions {
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="container">
  <form bind:this={form} onsubmit="event.preventDefault(); return;">
    <SInput
      type={'email'}
      id={'email'}
      name={'email'}
      label="login.email"
      required={true} />
    <SInput
      type={'password'}
      id={'password'}
      name={'password'}
      label="login.password"
      required={true} />
    <div class="actions">
      <button on:click={() => Utils.redirect('/register')}>
        {$_('login.register')}
      </button>
      <button
        class="primary"
        disabled={!canLogin}
        on:click={() => handleLogin()}>
        {$_('login.login')}
      </button>
    </div>
  </form>
  <LoadingSpinner {isLoading} backgroundColor={'rgba(0, 0, 0, 0.05)'} />
</div>
<Toast bind:this={toast} />
