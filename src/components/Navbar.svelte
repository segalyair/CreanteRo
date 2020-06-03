<script>
  import { RouteValues } from "../router/routes.js";
  import { getContext } from "svelte";
  import page from "page.js";
  import { current_route } from "../store.js";
  let current_route_value = {};
  const unsubscribe = current_route.subscribe(value => {
    current_route_value = value;
  });
</script>

<style>
  .navbar {
    min-width: 9vw;
    width: 9vw;
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
    margin-top: 1vh;
  }
  .route {
    margin: 1vw 0;
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
  .route a:hover {
    text-decoration: none;
    color: #1b6dc1;
  }
  .route:hover {
    background-color: #ffe17f75;
  }
  .route.active{
      background-color: #ffe17fd5;
  }
</style>

<div class="navbar">
  <a href={RouteValues.Home.href}>
    <img class="logo" src="logo200.png" alt="Bursa de creante" />
  </a>
  <div class="routes">
    <div
      class="route"
      class:active={current_route_value.value === RouteValues.Login.value}>
      <a href={RouteValues.Login.href}>{RouteValues.Login.value}</a>
    </div>
    <div
      class="route"
      class:active={current_route_value.value === RouteValues.List.value}>
      <a href={RouteValues.List.href}>{RouteValues.List.value}</a>
    </div>
  </div>
</div>
