import { writable } from 'svelte/store'
export const store = writable(localStorage.getItem("store") || "");
store.subscribe(val => localStorage.setItem("store", val));