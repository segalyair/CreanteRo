<script>
  import { getContext, setContext, afterUpdate } from "svelte";
  import { current_route } from "../store.js";
  import { routes } from "./routes.js";
  import { auth } from "../firebase/firebase";
  import page from "page.js";

  const path = routes.find(r => r.value === location.pathname);
  current_route.set(path ? path : routes[routes.length - 1]);
  for (let route of routes) {
    page(route.href, async () => {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      if (route.guard) {
        const result = route.guard();
        if (result) {
          current_route.set(route);
        }
      } else {
        current_route.set(route);
      }
    });
  }
  page.start({ hashbang: false });
</script>

<style>
  .content {
    width: 100%;
    height: 100%;
  }
</style>

<div class="content">
  <svelte:component this={$current_route.component} />
</div>
