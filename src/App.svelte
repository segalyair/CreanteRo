<script>
  import Navbar from "./components/Navbar.svelte";
  import SvelteHeader from "./components/Svelte-Header.svelte";
  import SvelteFooter from "./components/Svelte-Footer.svelte";
  import LoadingSpinner from "./Components/Common/LoadingSpinner.svelte";
  import Router from "./router/Router.svelte";
  import { auth } from "./firebase/firebase";
  import { UserService } from "./services/user-service.js";
  import { current_user } from "./store.js";
  import { setupI18n } from "./i18n";
  setupI18n({ withLocale: "ro" });

  $: isReady = isUserLoaded;
  let isUserLoaded = false;
  auth.onAuthStateChanged(async user => {
    if (isUserLoaded) return;
    if (user && !user.isAnonymous) {
      try {
        const currentUser = await UserService.getById(user.uid);
        current_user.set(currentUser);
      } catch (error) {
        //User doesn't exist in db
        await auth.signInAnonymously();
      }
    } else if (!user) {
      await auth.signInAnonymously();
    }
    isUserLoaded = true;
  });
</script>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    overflow-x: hidden;
    padding: 0 !important;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  :global(button) {
    user-select: none;
    cursor: pointer;
    margin: 0;
    border-radius: 4px;
    min-width: 50px;
  }
  :global(button.primary) {
    background-color: #1b6dc1;
    color: white;
  }
  :global(button.primary):hover {
    background-color: #357ec7;
    transition: all 200ms;
  }
  :global(button):hover {
    background-color: lightgray;
    transition: all 200ms;
  }
  :global(button):disabled {
    cursor: not-allowed;
  }
  :global(button.primary):disabled {
    color: #999;
    background-color: #f4f4f4;
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
    background-color: #d3d3d33d;
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
{:else}
  <LoadingSpinner isLoading={true} />
{/if}
