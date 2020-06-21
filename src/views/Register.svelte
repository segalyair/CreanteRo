<script>
  import { UserService } from "../services/user-service.js";
  import { auth } from "../firebase/firebase";
  import { Utils } from "../utils.js";
  let model = {
    email: null,
    customerType: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
    phone: null,
    address: null,
    iban: null,
    country: null,
    city: null,
    sector: null,
    street: null,
    streetNr: null,
    postalCode: null,
    block: null,
    floor: null,
    apartmentNr: null,
    isTutorialDone: false
  };
  $: passwordConfirmed = model.password === model.confirmPassword;
  $: canRegister =
    !Object.keys(model).find(k => model[k] === null) && passwordConfirmed;

  async function register() {
    const formData = new FormData();
    formData.set("userRaw", JSON.stringify(model));
    try {
      const user = await UserService.register(formData);
      if (user) {
        await auth.signInWithEmailAndPassword(model.email, model.password);
        Utils.redirect("/list");
      }
    } catch (error) {}
  }
</script>

<style>
  h2 {
    margin-bottom: 20px;
  }
  .label {
    display: inline-block;
    min-width: 200px;
    text-align: right;
    user-select: none;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"] {
    width: 300px;
  }
  .container {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 100%;
  }
  .sub-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 300px;
  }
  .required {
    color: red;
    font-size: 22px;
  }
  .register {
    margin-top: auto;
    width: 200px;
    align-self: center;
  }
</style>

<div class="container">
  <div class="sub-container">
    <h2>Personal Data</h2>
    <label>
      <span class="label">
        First Name
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.firstName} />
    </label>
    <label>
      <span class="label">
        Last Name
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.lastName} />
    </label>
    <label>
      <span class="label">
        Address
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.address} />
    </label>
    <label>
      <span class="label">
        Phone
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.phone} />
    </label>
    <label>
      <span class="label">
        Country
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.country} />
    </label>
    <label>
      <span class="label">
        City
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.city} />
    </label>
    <label>
      <span class="label">
        Sector
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.sector} />
    </label>
    <label>
      <span class="label">
        Street
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.street} />
    </label>
    <label>
      <span class="label">
        Street Number
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.streetNr} />
    </label>
    <label>
      <span class="label">
        Postal Code
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.postalCode} />
    </label>
    <label>
      <span class="label">
        Block
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.block} />
    </label>
    <label>
      <span class="label">
        Floor
        <span class="required">*</span>
      </span>
      <input type="number" bind:value={model.floor} />
    </label>
    <label>
      <span class="label">
        Apartment Number
        <span class="required">*</span>
      </span>
      <input type="number" bind:value={model.apartmentNr} />
    </label>
  </div>
  <div class="sub-container">
    <h2>Account Data</h2>
    <label>
      <span class="label">
        Email
        <span class="required">*</span>
      </span>
      <input type="email" bind:value={model.email} />
    </label>
    <label>
      <span class="label">
        Password
        <span class="required">*</span>
      </span>
      <input type="password" bind:value={model.password} />
    </label>
    <label>
      <span class="label">
        Confirm Password
        <span class="required">*</span>
      </span>
      <input type="password" bind:value={model.confirmPassword} />
    </label>
    <label>
      <span class="label">
        Customer Type
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.customerType} />
    </label>
    <label>
      <span class="label">
        IBAN
        <span class="required">*</span>
      </span>
      <input type="text" bind:value={model.iban} />
    </label>
    <button disabled={!canRegister} on:click={register} class="register">
      Register
    </button>
  </div>
</div>
