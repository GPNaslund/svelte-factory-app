<script>
	import { videoToDisplay, showMainMenu } from '$lib/stores';
	import { onMount } from 'svelte';

	function returnToMainMenu() {
		videoToDisplay.set("");
		showMainMenu.set(true);
	}

	/**
	 * @type {string}
	 */
	let videoUrl;

    /**
	 * @type {boolean}
	 */
    let isSafari;

	onMount(() => {
		const unsubscribe = videoToDisplay.subscribe((value) => {
			videoUrl = value;
		});

		const videoElement = document.querySelector("video");
		videoElement?.addEventListener('canplay', () => {
			videoElement.play();
		});

        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		return unsubscribe;
	});
</script>

<div style={isSafari ? `background-image: url(${videoUrl}); background-size: 100% 100%; background-position: center;` : ""}>
    {#if !isSafari}
	<video src={videoUrl}  muted playsinline disablepictureinpicture></video>
    {/if}
	<button on:click={returnToMainMenu} />
</div>

<style>
    div {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        z-index: 5;
    }
	button {
		background: url('/Back.png') no-repeat center center / contain;
		border: none;
		cursor: pointer;
		width: 4vw;
		height: 4vw;
		display: block;
		object-fit: contain;
		padding: 0;
		background-color: transparent;
		position: fixed;
		bottom: 4vh;
		right: 2vw;
		z-index: 10;
	}
</style>
