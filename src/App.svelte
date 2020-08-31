<script>
  import Navbar from "./components/Navbar.svelte";
  import SvelteHeader from "./components/Svelte-Header.svelte";
  import SvelteFooter from "./components/Svelte-Footer.svelte";
  import Router from "./router/Router.svelte";
  import { auth } from "./firebase/firebase";
  import { UserService } from "./services/user-service.js";
  import { current_user } from "./store.js";
  $: isReady = isUserLoaded;
  let isUserLoaded = false;
  auth.onAuthStateChanged(async user => {
    if (!isUserLoaded && user) {
      isUserLoaded = true;
      if (!user.isAnonymous) {
        current_user.set(await UserService.getById(user.uid));
        console.log($current_user)
      }
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
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
  /* width */
  :global(::-webkit-scrollbar) {
    width: 10px;
  }

  /* Track */
  :global(::-webkit-scrollbar-track) {
    background: #f1f1f1;
    border-radius: 4px;
  }

  /* Handle */
  :global(::-webkit-scrollbar-thumb) {
    background: #888;
    border-radius: 4px;
  }

  /* Handle on hover */
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #555;
  }

  #app {
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .router {
    padding: 10px;
    flex-grow: 1;
  }
</style>

{#if isReady}
  <div id="app">
    <Navbar />
    <div class="router">
      <Router />
    </div>
    <!-- <SvelteFooter /> -->
  </div>
{/if}
