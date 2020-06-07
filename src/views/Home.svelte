<script>
  import Payment from "../components/payment/Payment.svelte";
</script>

<style>
  .container {
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  h1 {
    font-size: 3vw;
    font-weight: 400;
  }
  h2 {
    font-size: 1.75vw;
    font-weight: 300;
  }
  span {
    font-size: 15vw;
  }
</style>

<div class="container">
  <h1>Bine ai venit la Bursa de Creante</h1>
  <h2>Singurul site unde poti cumpara si vinde creante rapid si usor</h2>
  <span>🤝</span>
  <!-- <Payment amount={19.99} description={"Creanta Description"}/> -->
</div>
