import Home from "../views/Home.svelte";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import List from "../views/List.svelte";
import AccountSettings from "../views/AccountSettings.svelte";
import NotFound from "../views/NotFound.svelte";
import Forbidden from "../views/Forbidden.svelte";
import { auth } from "../firebase/firebase";
export const routes = [
    { href: '/', value: 'Home', component: Home },
    {
        href: '/list', value: 'List', component: List,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/settings', value: 'Settings', component: AccountSettings,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/login', value: 'Login', component: Login, guard: () => {
            return auth.currentUser && auth.currentUser.isAnonymous
        }
    },
    {
        href: '/register', value: 'Register', component: Register, guard: () => {
            return auth.currentUser && auth.currentUser.isAnonymous
        }
    },
    { href: '/forbidden', value: 'Forbidden', component: Forbidden },
    { href: '*', component: NotFound }
]
export class RouteValues {
    static get Home() { return routes[0] }
    static get List() { return routes[1] }
    static get Login() { return routes[2] }
    static get Register() { return routes[3] }
}
