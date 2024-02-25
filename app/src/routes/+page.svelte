<script>
	export const prerender = true;
	import LoadingScreen from "../LoadingScreen.svelte";
	import { showMainMenu, videoToDisplay } from "$lib/stores";
	import MainMenu from "../MainMenu.svelte";
	import SelectedVideo from "../SelectedVideo.svelte";
	import { onMount } from "svelte";
	import OrientationOverlay from "../OrientationOverlay.svelte";

	/**
	 * @type {boolean}
	 */
	let showMainMenuValue;
	/**
	 * @type {string}
	 */
	let videoToDisplayValue;

	showMainMenu.subscribe((value => {
		showMainMenuValue = value;
	}))

	videoToDisplay.subscribe((value) => {
		videoToDisplayValue = value;
	})

	let hasTouch = false;

	onMount(() => {
		hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	})

</script>

{#if showMainMenuValue && !videoToDisplayValue}
<MainMenu />
{/if}

<LoadingScreen 
	isBackground={showMainMenuValue ? true : false}
/>

{#if videoToDisplayValue}
<SelectedVideo />
{/if}

{#if hasTouch}
<OrientationOverlay />
{/if}

<style>
	:global(body) {
		margin: 0;
		width: 100vw; /* Fallback value*/
		width: 100dvw;
		height: 100vh; /* Fallback value */
		height: 100dvh;
		overflow: hidden;
		font-family: Arial, sans-serif;
		font-weight: bold;
		background-color: black;
	}
</style>
