<script>
  import { onMount } from "svelte";
  import { UserService } from "../services/user-service.js";
  import { auth } from "../firebase/firebase";
  import { Utils } from "../utils.js";
  import { slide, fade } from "svelte/transition";
  import { current_user } from "../store.js";
  import SInput from "../components/common/inputs/SInput.svelte";
  import FileUpload from "../components/common/FileUpload.svelte";
  import LoadingSpinner from "../Components/Common/LoadingSpinner.svelte";
  // const cnpRegex = new RegExp(
  //     /\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b/
  //   ),
  //   ibanRegex = new RegExp(/^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$/);
  let isLoading = false,
    form,
    canRegister,
    passwordErrors = [];
  function passwordsValid() {
    return (
      form &&
      form.elements.password.value.length > 5 &&
      form.elements.confirmPassword.value.length > 5
    );
  }
  function passwordValidate() {
    const passwordsNotEqual =
      form && form.elements.password.value !== form.confirmPassword.value;
    if (passwordsValid() && passwordsNotEqual) {
      passwordErrors = ["Password and Confirm Password has to match"];
    } else {
      passwordErrors = [];
    }
  }
  async function register() {
    isLoading = true;
    isRegisterPressed = true;
    try {
      const formData = new FormData(),
        userRaw = {},
        identityCardRaw = {};
      for (const [key, value] of Object.entries(model)) {
        userRaw[key] = value.value;
      }
      for (const [key, value] of Object.entries(idCardModel)) {
        if (key === "number") {
          identityCardRaw[key] = value.value.toString();
        } else {
          identityCardRaw[key] = value.value;
        }
      }
      formData.set("userRaw", JSON.stringify(userRaw));
      formData.set("identityCardRaw", JSON.stringify(identityCardRaw));
      formData.set(
        "bankAccountRaw",
        JSON.stringify({
          iban: userRaw.iban,
          bankName: userRaw.bankName
        })
      );
      formData.append("photo", userRaw.photo.blob);

      const user = await UserService.register(formData);
      if (user) {
        const userCredential = await auth.signInWithEmailAndPassword(
          model.email.value,
          model.password.value
        );
        current_user.set(await UserService.getById(userCredential.user.uid));
        Utils.redirect("/list");
      }
    } catch (error) {
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
      canRegister =
        emailValid && passwordsValid() && passwordErrors.length === 0;
    });
  });
</script>

<style>
  .register-container {
    height: 100%;
    display: flex;
    flex-direction: column;
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
      <form bind:this={form} on:submit={register}>
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
        <button class="register" disabled={!canRegister}>Register</button>
      </form>
    </div>
  </div>
  <LoadingSpinner {isLoading} backgroundColor={'rgba(0, 0, 0, 0.05)'} />
</div>
