<script>
	export const prerender = true;
	import LoadingScreen from "../LoadingScreen.svelte";
	import { showMainMenu, videoToDisplay } from "$lib/stores";
	import MainMenu from "../MainMenu.svelte";
	import SelectedVideo from "../SelectedVideo.svelte";

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

</script>

{#if !showMainMenuValue && !videoToDisplayValue}
<LoadingScreen />
{/if}

{#if showMainMenuValue && !videoToDisplayValue}
<MainMenu />
{/if}

{#if videoToDisplayValue}
<SelectedVideo />
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
