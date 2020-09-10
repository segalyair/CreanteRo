<script>
  import { auth } from "../firebase/firebase";
  import { fade } from "svelte/transition";
  import { Utils } from "../utils.js";
  import { current_user } from "../store.js";
  import { UserService } from "../services/user-service.js";
  let model = { errors: { email: [], password: [], other: [] } };
  $: isValid =
    model.email &&
    model.email.length > 0 &&
    model.password &&
    model.password.length > 5;
  $: anyError = field => model.errors[field].length > 5;
  async function handleLogin(type) {
    if (!isValid) return;
    model.errors = { email: [], password: [], other: [] };
    try {
      const userCredential =
        type === "create"
          ? await auth.createUserWithEmailAndPassword(
              model.email,
              model.password
            )
          : await auth.signInWithEmailAndPassword(model.email, model.password);
      current_user.set(await UserService.getById(userCredential.user.uid));
      Utils.redirect("/list");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          addError("email", error.code, "Invalid Email");
          break;
        case "auth/weak-password":
          addError("password", error.code, error.message);
          break;
        case "auth/email-already-in-use":
          addError("other", error.code, "Email already registered");
          break;
        case "auth/user-not-found":
          addError("other", error.code, "Incorrect Email or Password");
          break;
        default:
          addError("other", error.code, error.message);
          break;
      }
      console.log(error);
    }
  }
  function addError(field, code, message) {
    model.errors[field] = [
      ...model.errors[field],
      { code: code, message: message }
    ];
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .form {
    width: 300px;
  }
  .errors {
    min-height: 1rem;
  }
  input {
    width: 100%;
    margin: 0;
  }
  .error {
    margin: 0;
    font-size: 12px;
    color: red;
  }
  .actions {
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="container">
  <div class="form">
    <div class="field">
      <label>Email</label>
      <input class="input" type="text" bind:value={model.email} />
      <div class="errors">
        {#each model.errors.email as error}
          <div class="transition" transition:fade={{ duration: 200 }}>
            <span class="error">{error.message}</span>
          </div>
        {/each}
      </div>
    </div>
    <div class="field">
      <label>Password</label>
      <input class="input" type="password" bind:value={model.password} />
      <div class="errors">
        {#each model.errors.password as error}
          <span class="error">{error.message}</span>
        {/each}
        {#each model.errors.other as error}
          <span class="error">{error.message}</span>
        {/each}
      </div>
    </div>
    <div class="actions">
      <!-- <a href={RouteValues.Register.href}>
        <button>Register</button>
      </a> -->
      <button disabled={!isValid} on:click={() => handleLogin('login')}>
        Login
      </button>
    </div>
  </div>
</div>
