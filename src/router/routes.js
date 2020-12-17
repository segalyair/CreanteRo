import Home from "../views/Home.svelte";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import List from "../views/List.svelte";
import AccountSettings from "../views/AccountSettings.svelte";
import NotFound from "../views/NotFound.svelte";
import Forbidden from "../views/Forbidden.svelte";
import Tutorial from "../views/Tutorial.svelte";
import Contact from "../views/Contact.svelte";
import { auth } from "../firebase/firebase";
export const routes = [
    { href: '/', value: 'Home', component: Home },
    {
        href: '/list', value: "List", i18n: "routes.list", component: List,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/account', value: 'Settings', i18n: "routes.myaccount", component: AccountSettings,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/tutorial', value: 'Tutorial', i18n: "routes.tutorial", component: Tutorial,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/contact', value: 'Contact', i18n: "routes.contact", component: Contact,
        guard: () => {
            return auth.currentUser && !auth.currentUser.isAnonymous
        }
    },
    {
        href: '/login', value: "Login", i18n: "routes.login", component: Login, guard: () => {
            return auth.currentUser && auth.currentUser.isAnonymous
        }
    },
    {
        href: '/register', value: "Register", i18n: "routes.register", component: Register, guard: () => {
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
