import Home from "../views/Home.svelte";
import Login from "../views/Login.svelte";
import List from "../views/List.svelte";
import NotFound from "../views/NotFound.svelte";
import { auth } from "../firebase/firebase";
export const routes = [
    { href: '/', value: 'Home', component: Home },
    {
        href: '/list', value: 'List', component: List
    },
    {
        href: '/login', value: 'Login', component: Login, guard: () => {
            return auth.currentUser.isAnonymous
        }
    },
    { href: '*', component: NotFound }
]
