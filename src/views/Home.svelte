<script>
  import { onMount } from "svelte";
  const stripe = Stripe("pk_test_nPcCBzLhDBFUlCGMPJ9wEzP400H19GXYT1");
  let api = "http://localhost:8600/payments/pay";
  const amount = 1999,
    receiptEmail = "test_mail@test_mail.com",
    currency = "RON",
    description = "Buy Creanta Test";
  // Payment Intents
  let elements = stripe.elements();
  let card; // HTML div to mount card
  let cardElement;
  let complete = false;
  let paymentIntent;
  let clientSecret;
  // Step 2
  async function createIntent() {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount, receiptEmail, currency, description })
    };
    const response = await fetch(api, params);
    return await response.json();
  }
  // Step 3
  async function createCardForm() {
    cardElement = elements.create("card");
    cardElement.mount(card);
    cardElement.on("change", e => (complete = e.complete));
  }
  // Step 4
  async function submitPayment() {
    const result = await stripe.handleCardPayment(clientSecret, cardElement, {
      payment_method_data: {}
    });
    paymentIntent = result.paymentIntent;
    console.log(paymentIntent);
    if (result.error) {
      console.error(error);
      alert("fudge!");
    }
  }
  async function startup() {
    paymentIntent = await createIntent();
    clientSecret = paymentIntent.client_secret;
    console.log(paymentIntent);
    createCardForm();
  }
  onMount(() => {
    startup();
  });
</script>

<style>
  section {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    border-radius: 5px; /* 5px rounded corners */
    width: 500px;
    padding: 2em;
    margin: 0 auto;
  }
  .elements {
    margin: 2em 0;
    background: rgb(230, 230, 230);
    border-radius: 5px;
    padding: 1em;
  }
  i {
    font-size: 5em;
    text-align: center;
    display: block;
    font-style: normal;
  }
  button {
    background: lightgreen;
    border: none;
  }
  button:disabled {
    background: #dddddd;
    cursor: not-allowed;
  }
</style>

<section>

  <h2>Payment Intents with Stripe Elements</h2>

  <i>⌚</i>

  <div class="elements" bind:this={card} />

  <button on:click={submitPayment} disabled={!paymentIntent || !complete}>
    Submit Payment for ${amount / 100}
  </button>

</section>

<!-- <div class="container">
  <h1 style="font-size:60px">Site-ul tău pentru creanțe, fără condoleanțe.</h1>
  <h2>Jmenu-i în bănetu-i.</h2>
  <span style="font-size:8px">Nu suntem implicati cu mafia.</span>
</div> -->
