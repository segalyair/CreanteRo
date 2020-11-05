<script>
  import Payment from "../components/payment/Payment.svelte";
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 100px;
    width: fit-content;
    border: 1px solid lightgray;
    border-radius: 12px;
    background-color: white;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 5px 5px 8px 0px rgba(0, 0, 0, 0.5);
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
    font-size: 10vw;
  }
</style>

<div class="container">
  <h1>Bine ai venit la Bursa de Creante</h1>
  <h2>Singurul site unde poti cumpara si vinde creante rapid si usor</h2>
  <span>🤝</span>
  <!-- <Payment amount={19.99} description={"Creanta Description"}/> -->
</div>
