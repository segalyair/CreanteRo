<script>
  import { setContext, afterUpdate } from "svelte";
  import { writable } from "svelte/store";
  import { routes } from "./routes.js";
  import { auth } from "../firebase/firebase";
  import page from "page.js";
  const current_route = writable({});
  setContext("current_route", current_route);
  const loginRoute = routes.find(r => r.value === "Login");
  for (let route of routes) {
    page(route.href, async () => {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      if (route.guard) {
        const result = route.guard();
        if (result) {
          $current_route = route;
        }
      } else {
        $current_route = route;
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
