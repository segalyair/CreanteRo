import { writable } from 'svelte/store'
export const current_user = writable(null)
export const current_route = writable({});
export const selected_product = writable(null);