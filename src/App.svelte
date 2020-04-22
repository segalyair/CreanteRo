<script>
  import SvelteHeader from "./components/Svelte-Header.svelte";
  import SvelteFooter from "./components/Svelte-Footer.svelte";
  import Router from "./router/Router.svelte";
  import { auth } from "./firebase/firebase";
  let isUserLoaded = false;
  auth.onAuthStateChanged(async user => {
    if (!isUserLoaded && user) {
      isUserLoaded = true;
    }
  });
</script>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    padding: 0 !important;
  }
  :global(button) {
    user-select: none;
    cursor: pointer;
    margin: 0;
  }
  :global(button):hover {
    background-color: lightgray;
    transition: background-color 200ms;
  }
  :global(button):disabled {
    cursor: not-allowed;
  }
  :global(h2),
  :global(h1) {
    margin: 0;
  }
  #app {
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<div id="app">
  <SvelteHeader />
  <Router />
  <SvelteFooter />
</div>
