<script>
  import { routes } from "../router/routes.js";
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
    justify-content: space-between;
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#f2f6f8+0,d8e1e7+50,b5c6d0+51,e0eff9+100;Grey+Gloss+%232 */
    background: rgb(242, 246, 248); /* Old browsers */
    background: -moz-linear-gradient(
      top,
      rgba(242, 246, 248, 1) 0%,
      rgba(216, 225, 231, 1) 50%,
      rgba(181, 198, 208, 1) 51%,
      rgba(224, 239, 249, 1) 100%
    ); /* FF3.6-15 */
    background: -webkit-linear-gradient(
      top,
      rgba(242, 246, 248, 1) 0%,
      rgba(216, 225, 231, 1) 50%,
      rgba(181, 198, 208, 1) 51%,
      rgba(224, 239, 249, 1) 100%
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      to bottom,
      rgba(242, 246, 248, 1) 0%,
      rgba(216, 225, 231, 1) 50%,
      rgba(181, 198, 208, 1) 51%,
      rgba(224, 239, 249, 1) 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#e0eff9',GradientType=0 ); /* IE6-9 */
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
  <div class="routes">
    <h2>Creante.ro</h2>
    {#each routes.filter(r => r.value) as route}
      {#if route.value !== 'Login' || currentUser.isAnonymous}
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
