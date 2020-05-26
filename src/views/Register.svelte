<script>
  let model = {
    email: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
    dateOfBirth: null
  };
</script>

<style>
  .container {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .sub-container {
    display: flex;
    flex-grow: 1;
  }
</style>

<div class="container">
  <div class="sub-container">
    <label>
      Email
      <input type="email" bind:value={model.email} />
    </label>
  </div>
  <div class="sub-container">
    <h2>Personal Data</h2>
  </div>
</div>
