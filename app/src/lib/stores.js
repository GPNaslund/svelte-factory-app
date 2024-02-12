import { writable } from 'svelte/store';

export const showMainMenu = writable(false);
export const videoUrls = writable([]);
export const videoToDisplay = writable("");