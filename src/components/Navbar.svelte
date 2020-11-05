<script>
  import { getContext } from "svelte";
  import { UserIcon } from "svelte-feather-icons";
  import page from "page.js";
  import { routes } from "../router/routes.js";
  import { current_route, current_user } from "../store.js";
  import { Utils } from "../utils.js";
  import { auth } from "../firebase/firebase";
  import LoadingSpinner from "../Components/Common/LoadingSpinner.svelte";
  let isLoading = false,
    currentUser,
    currentRoutes = [];
  const ignoredRoutes = ["/", "*", "/forbidden", "/settings"];
  async function signOut() {
    isLoading = true;
    await auth.signOut();
    current_user.set(null);
    await auth.signInAnonymously();
    isLoading = false;
    Utils.redirect("/login");
  }
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      currentRoutes = routes.filter(
        r => !ignoredRoutes.includes(r.href) && (!r.guard || r.guard())
      );
    }
  });
  window.addEventListener("hashchange", () => {
    currentRoutes = routes.filter(
      r => !ignoredRoutes.includes(r.href) && (!r.guard || r.guard())
    );
  });
</script>

<style>
  .navbar {
    position: relative;
    z-index: 1;
    min-width: 10.5vw;
    width: 10.5vw;
    display: flex;
    flex-direction: column;
    background-color: white;
    transition: width 200ms;
    border-right: 1px solid lightgray;
    -webkit-box-shadow: 9px 0px 8px 0px rgba(0, 0, 0, 0.4);
    box-shadow: 9px 0px 8px 0px rgba(0, 0, 0, 0.4);
  }
  .logo {
    max-width: 100%;
    max-height: 100%;
    padding: 1vh 0.5vw 0 0.5vw;
    margin-bottom: 10vh;
  }
  .routes {
    display: flex;
    flex-direction: column;
    margin-top: 1vh;
    margin-bottom: 1vh;
    height: 100%;
  }
  .route {
    padding: 10px 0;
    text-align: center;
    font-size: 1.4vw;
    cursor: pointer;
    color: #1b6dc1;
    border-top: 1px solid lightgray;
    /* border-radius: 14px; */
    outline: none;
    user-select: none;
    transition: background-color 200ms;
  }
  .route.last {
    border-bottom: 1px solid lightgray;
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
  .route:hover:not(.signout) {
    background-color: #ffe17f75;
    text-decoration: none;
  }
  .route.active {
    background-color: #ffe17fd5;
  }
  .signout-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .icon-container {
    border: 1px solid lightgray;
    border-radius: 28px;
    cursor: pointer;
    background-color: rgba(211, 211, 211, 0.1);
  }
  .signout {
    font-size: 1.2em;
  }
</style>

<div class="navbar">
  <a href={routes.find(r => r.value === 'Home').href}>
    <img class="logo" src="logo200.png" alt="Bursa de creante" />
  </a>
  <div class="routes">
    {#each currentRoutes as route, i}
      <a
        class="route"
        class:active={$current_route.value === route.value}
        class:last={i + 1 === currentRoutes.length}
        on:click={e => Utils.redirect(route.href)}
        href="javascript:void(0)">
        {route.value}
      </a>
    {/each}
    <div class="fill-gap" />
    {#if currentUser && !currentUser.isAnonymous}
      <div class="signout-container">
        <div on:click={e => Utils.redirect('/settings')} class="icon-container">
          <UserIcon size="50" />
        </div>
        <div class="route signout" on:click={signOut}>
          <a href="javascript:void(0)">Sign Out</a>
        </div>
      </div>
    {/if}
  </div>
</div>
<LoadingSpinner {isLoading} backgroundColor={'white'} />
