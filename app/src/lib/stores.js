import { writable } from 'svelte/store';

export const videosLoaded = writable(0);
export const videosToLoad = writable(0);
export const showMainMenu = writable(false);
export const videoUrls = writable([]);
export const videoToDisplay = writable("");