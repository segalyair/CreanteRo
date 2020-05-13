<script>
  import { onMount } from "svelte";
  const stripe = Stripe("pk_test_nPcCBzLhDBFUlCGMPJ9wEzP400H19GXYT1"),
    amount = 1999,
    receiptEmail = "test_mail@test_mail.com",
    currency = "RON",
    description = "Buy Creanta Test";
  // Payment Intents
  let elements = stripe.elements(),
    api = "http://localhost:8600/payments/pay",
    card, // HTML div to mount card
    cardElement,
    complete = false,
    paymentIntent,
    clientSecret;
  // Step 2
  async function createIntent() {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount, receiptEmail, currency, description })
    });
    const clientSecret = await response.text();
    return clientSecret;
  }
  // Step 3
  async function createCardForm() {
    cardElement = elements.create("card");
    cardElement.mount(card);
    cardElement.on("change", e => (complete = e.complete));
  }
  // Step 4
  async function submitPayment() {
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Jenny Rosen"
          }
        }
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  async function startup() {
    clientSecret = await createIntent();
    createCardForm();
  }
  onMount(async () => {
    await startup();
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 500px;
    padding: 1em;
    margin: 0 auto;
  }
  .elements {
    margin-bottom: 1em;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.185);
    padding: 1em;
  }
  button {
    background: rgb(72, 243, 72);
    border: none;
  }
  button:disabled {
    background: #dddddd;
    cursor: not-allowed;
  }
</style>

<div class="container">
  <div class="elements" bind:this={card} />

  <button on:click={submitPayment} disabled={!complete}>Confirm Payment</button>

</div>

<!-- <div class="container">
  <h1 style="font-size:60px">Site-ul tău pentru creanțe, fără condoleanțe.</h1>
  <h2>Jmenu-i în bănetu-i.</h2>
  <span style="font-size:8px">Nu suntem implicati cu mafia.</span>
</div> -->
