<script>
  import { UserService } from "../services/user-service.js";
  import { auth } from "../firebase/firebase";
  import { Utils } from "../utils.js";
  import { slide, fade } from "svelte/transition";
  import { current_user } from "../store.js";
  import FileUpload from "../components/common/FileUpload.svelte";
  import LoadingSpinner from "../Components/Common/LoadingSpinner.svelte";
  let model = {
      email: {},
      customerType: {},
      password: {},
      confirmPassword: {},
      firstName: {},
      lastName: {},
      phone: {},
      address: {},
      bankName: {},
      iban: {},
      photo: {},
      // country: {},
      // city: {},
      // sector: {},
      // street: {},
      // streetNr: {},
      // postalCode: {},
      // block: {},
      // floor: {},
      // apartmentNr: {},
      isTutorialDone: false
    },
    idCardModel = {
      cnp: {},
      series: {},
      number: {},
      identityIssuer: {},
      expiryDate: {}
    },
    isLoading = false,
    isRegisterPressed = false;
  const cnpRegex = new RegExp(
      /\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b/
    ),
    ibanRegex = new RegExp(/^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$/),
    emailRegex = new RegExp(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
  $: passwordConfirmed =
    model.password &&
    model.password.length > 5 &&
    model.password.value === model.confirmPassword.value;
  $: ibanIsValid = ibanRegex.test(model.iban.value);
  $: cnpIsValid = cnpRegex.test(idCardModel.cnp.value);
  $: emailIsValid = emailRegex.test(model.email.value);
  $: canRegister = passwordConfirmed && emailIsValid;
  // !Object.keys(model).find(k => !model[k] || !model[k].value) &&
  // passwordConfirmed &&
  // cnpIsValid;
  // &&
  // ibanIsValid;
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
  h2 {
    margin-bottom: 20px;
  }
  label {
    display: flex;
    margin-bottom: 10px;
  }
  .label {
    min-width: 200px;
    text-align: right;
    user-select: none;
    margin-right: 20px;
  }
  input[type="text"],
  textarea,
  input[type="email"],
  input[type="password"] {
    width: 300px;
    margin: 0;
  }

  .input-container {
    display: flex;
    flex-direction: column;
  }

  textarea {
    resize: vertical;
    height: 150px;
  }

  .error {
    border: 1px red solid;
  }
  .error-message {
    color: red;
    font-size: 14px;
  }

  .sub-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    min-width: 300px;
    height: 100%;
  }
  .required {
    color: red;
    font-size: 22px;
  }
  .action-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .register-button {
    width: 200px;
    height: 50px;
  }
</style>

<div class="register-container">
  <div class="fill-gap" />
  <div class="container">
    <!-- <div class="sub-container">
      <h2>Personal Data</h2>
      <label>
        <span class="label">
          First Name
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.firstName.value} />
      </label>
      <label>
        <span class="label">
          Last Name
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.lastName.value} />
      </label>
      <label>
        <span class="label">
          Address
          <span class="required">*</span>
        </span>
        <textarea type="text" bind:value={model.address.value} />
      </label>
      <label>
        <span class="label">
          Phone
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.phone.value} />
      </label>
      <!-- <label>
      <span class="label">
        Country
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.country.value} />
    </label>
    <label>
      <span class="label">
        City
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.city.value} />
    </label>
    <label>
      <span class="label">
        Sector
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.sector.value} />
    </label>
    <label>
      <span class="label">
        Street
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.street.value} />
    </label>
    <label>
      <span class="label">
        Street Number
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.streetNr.value} />
    </label>
    <label>
      <span class="label">
        Postal Code
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.postalCode.value} />
    </label>
    <label>
      <span class="label">
        Block
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.block.value} />
    </label>
    <label>
      <span class="label">
        Floor
        <span class="required">*</span>
      </span>
      <input type="number" bind:value={model.floor.value} />
    </label>
    <label>
      <span class="label">
        Apartment Number
        <span class="required">*</span>
      </span>
      <input type="number" bind:value={model.apartmentNr.value} />
    </label> 
    </div>-->
    <div class="sub-container">
      <!-- <h2>Account Data</h2> -->
      <label>
        <span class="label">
          Email
          <span class="required">*</span>
        </span>
        <input type="email" bind:value={model.email.value} />
      </label>
      <label>
        <span class="label">
          Password
          <span class="required">*</span>
        </span>
        <input type="password" bind:value={model.password.value} />
        {#if isRegisterPressed}
          {#if !model.password.value || model.password.value < 6 }
            <div class="transition" transition:fade={{ duration: 200 }}>
              <span class="error">Password must be at least 6 characters</span>
            </div>
          {/if}
        {/if}
      </label>
      <label>
        <span class="label">
          Confirm Password
          <span class="required">*</span>
        </span>
        <input type="password" bind:value={model.confirmPassword.value} />
        {#if isRegisterPressed}
          {#if !model.confirmPassword.value || model.confirmPassword.value != model.password.value }
            <div class="transition" transition:fade={{ duration: 200 }}>
              <span class="error">Must be the same as password</span>
            </div>
          {/if}
        {/if}
      </label>
      <!-- <label>
        <span class="label">
          Customer Type
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.customerType.value} />
      </label>
      <label>
        <span class="label">
          Bank
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={model.bankName.value} />
      </label>
      <label>
        <span class="label">
          IBAN
          <span class="required">*</span>
        </span>
        <div class="input-container">
          <input
            type="text"
            bind:value={model.iban.value}
            on:input={e => (model.iban.dirty = true)}
            on:blur={e => (model.iban.blurred = model.iban.dirty)}
            class:error={!ibanIsValid && model.iban.dirty && model.iban.blurred} />
          {#if !ibanIsValid && model.iban.dirty && model.iban.blurred}
            <div transition:slide|local>
              <span class="error-message">Invalid IBAN</span>
            </div>
          {/if}
        </div>
      </label>
      <label>
        <span class="label">
          CNP
          <span class="required">*</span>
        </span>
        <div class="input-container">
          <input
            type="text"
            bind:value={idCardModel.cnp.value}
            on:input={e => (idCardModel.cnp.dirty = true)}
            on:blur={e => (idCardModel.cnp.blurred = idCardModel.cnp.dirty)}
            class:error={!cnpIsValid && idCardModel.cnp.dirty && idCardModel.cnp.blurred} />
          {#if !cnpIsValid && idCardModel.cnp.dirty && idCardModel.cnp.blurred}
            <div transition:slide|local>
              <span class="error-message">Invalid CNP</span>
            </div>
          {/if}
        </div>
      </label>
      <label>
        <span class="label">
          Series
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={idCardModel.series.value} />
      </label>
      <label>
        <span class="label">
          Number
          <span class="required">*</span>
        </span>
        <input type="number" bind:value={idCardModel.number.value} />
      </label>
      <label>
        <span class="label">
          Issuer
          <span class="required">*</span>
        </span>
        <input type="text" bind:value={idCardModel.identityIssuer.value} />
      </label>
      <label>
        <span class="label">
          Expiry Date
          <span class="required">*</span>
        </span>
        <input type="date" bind:value={idCardModel.expiryDate.value} />
      </label>
      <label>
        <span class="label">
          Photo
          <span class="required">*</span>
        </span>
        <FileUpload on:file={e => (model.photo.value = e.detail)} />
      </label> -->
    </div>
  </div>
  <div class="action-container">
    <button disabled={!canRegister} on:click={register} class="register-button">
      Register
    </button>
  </div>
  <LoadingSpinner {isLoading} backgroundColor={'rgba(0, 0, 0, 0.05)'} />
</div>
