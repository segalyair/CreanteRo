<script>
  import { routes, RouteValues } from "../router/routes.js";
  import { auth } from "../firebase/firebase";
  import { LogOutIcon } from "svelte-feather-icons";
  let currentUser = {};
  async function signOut() {
    try {
      auth.signOut();
      await auth.signInAnonymously();
    } catch (error) {
      console.log(error);
    }
  }
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
    }
  });
</script>

<style>
  h2 {
    margin-right: 32px;
  }
  .header {
    margin-bottom: 10px;
    display: flex;
    background-color: white;
    padding: 8px 0 8px 8px;
  }
  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
  }
  .routes {
    display: flex;
    align-items: center;
  }
  .user span,
  .link {
    margin-right: 10px;
  }
  .signout-button {
    border: 0;
    background-color: white;
    border-radius: 16px;
    height: 28px;
    width: 28px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="header">
  <img src="logo200.png" alt="Bursa de creante" />
  <div class="routes">
    {#each routes.filter(r => r.value) as route}
      {#if (route.value === RouteValues.Login && currentUser.isAnonymous) || (route.value === RouteValues.List && !currentUser.isAnonymous)}
        <div class="link">
          <a href={route.href}>{route.value}</a>
        </div>
      {/if}
    {/each}
  </div>
  <div class="user">
    {#if currentUser}
      <span>{currentUser.isAnonymous ? 'User' : currentUser.email}</span>
    {:else}
      <span />
    {/if}
    {#if currentUser && currentUser.isAnonymous === false}
      <div class="link">
        <button class="signout-button" on:click={signOut}>
          <LogOutIcon size="18" />
        </button>
      </div>
    {/if}
  </div>
</div>
