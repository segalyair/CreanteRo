<script>
  import { getContext } from "svelte";
  import page from "page.js";
  import { routes } from "../router/routes.js";
  import { current_route, current_user } from "../store.js";
  import { Utils } from "../utils.js";
  import { auth } from "../firebase/firebase";

  let currentUser,
    currentRoutes = [];
  async function signOut() {
    await auth.signOut();
    current_user.set(null);
    await auth.signInAnonymously();
    Utils.redirect("/login");
  }
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      currentRoutes = routes.filter(
        r =>
          !["/", "*", "/forbidden"].includes(r.href) && (!r.guard || r.guard())
      );
    }
  });
  window.addEventListener("hashchange", () => {
    currentRoutes = routes.filter(
      r => !["/", "*", "/forbidden"].includes(r.href) && (!r.guard || r.guard())
    );
  });
</script>

<style>
  .navbar {
    min-width: 10.5vw;
    width: 10.5vw;
    display: flex;
    flex-direction: column;
    transition: width 200ms;
    margin: 1vh 0 0 0.5vw;
  }
  .logo {
    max-width: 100%;
    max-height: 100%;
  }
  .routes {
    display: flex;
    flex-direction: column;
    margin-top: 1vh;
    margin-bottom: 1vh;
    height: 100%;
  }
  .route {
    margin: 0.2vw 0;
    padding: 0 1vh;
    text-align: center;
    font-size: 1.4vw;
    cursor: pointer;
    color: #1b6dc1;
    border-radius: 14px;
    outline: none;
    user-select: none;
    transition: background-color 200ms;
  }
  .fill-gap {
    flex-grow: 1;
  }
  .route a:hover {
    text-decoration: none;
    color: #1b6dc1;
  }
  .route a:visited {
    color: #1b6dc1;
  }
  .route:hover {
    background-color: #ffe17f75;
    text-decoration: none;
  }
  .route.active {
    background-color: #ffe17fd5;
  }
</style>

<div class="navbar">
  <a href={routes.find(r => r.value === 'Home').href}>
    <img class="logo" src="logo200.png" alt="Bursa de creante" />
  </a>
  <div class="routes">
    {#each currentRoutes as route}
      <a
        class="route"
        class:active={$current_route.value === route.value}
        href={route.href}>
        {route.value}
      </a>
    {/each}
    <div class="fill-gap" />
    {#if currentUser && !currentUser.isAnonymous}
      <div class="route" on:click={signOut}>
        <a href="javascript:void(0)">Sign Out</a>
      </div>
    {/if}
  </div>
</div>
