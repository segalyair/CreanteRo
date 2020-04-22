import Home from "../views/Home.svelte";
import Login from "../views/Login.svelte";
import NotFound from "../views/NotFound.svelte";
import { auth } from "../firebase/firebase";
export const routes = [
    { href: '/', value: 'Home', component: Home },
    {
        href: '/login', value: 'Login', component: Login, guard: () => {
            return auth.currentUser.isAnonymous
        }
    },
    { href: '*', component: NotFound }
]
