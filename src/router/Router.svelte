<script>
  import { getContext, setContext, afterUpdate } from "svelte";
  import { current_route } from "../store.js";
  import { Utils } from "../utils.js";
  import { routes } from "./routes.js";
  import { auth } from "../firebase/firebase";
  import page from "page.js";
  const path = routes.find(r => r.href === location.pathname);
  current_route.set(path ? path : routes[routes.length - 1]);
  for (let route of routes) {
    page(route.href, async () => {
      if (!route.guard || route.guard()) {
        current_route.set(route);
      } else {
        Utils.redirect("/forbidden");
      }
    });
  }
  page.start({ hashbang: false });
</script>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="content">
  <svelte:component this={$current_route.component} />
</div>
