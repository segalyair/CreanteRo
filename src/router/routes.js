import Home from "../views/Home.svelte";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import List from "../views/List.svelte";
import NotFound from "../views/NotFound.svelte";
import { auth } from "../firebase/firebase";
export class RouteValues {
    static get Home() { return 'Home' }
    static get List() { return 'List' }
    static get Login() { return 'Login' }
    static get Register() { return 'Register' }
}
export const routes = [
    { href: '/', value: RouteValues.Home, component: Home },
    {
        href: '/list', value: RouteValues.List, component: List, guard: () => {
            return !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/login', value: RouteValues.Login, component: Login, guard: () => {
            return auth.currentUser.isAnonymous
        }
    },
    {
        href: '/register', value: RouteValues.Register, component: Register, guard: () => {
            return auth.currentUser.isAnonymous
        }
    },
    { href: '*', component: NotFound }
]
