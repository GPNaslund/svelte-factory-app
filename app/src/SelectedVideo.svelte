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

	let buttonContainerSize = {width: 0, height: 0}
	const videoAspectRatio = 16 / 9;

	onMount(() => {
		const unsubscribe = videoToDisplay.subscribe((value) => {
			videoUrl = value;
		});

		const videoElement = document.querySelector("video");
		videoElement?.addEventListener('canplay', () => {
			videoElement.play();
		});

        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		const updateButtonContainerSize = () => {
			const container = document.querySelector("#main-container");
			if (!container) return;

			// @ts-ignore
			const containerWidth = container.offsetWidth;
			// @ts-ignore
			const containerHeight = container.offsetHeight;
			let displayedVideoWidth, displayedVideoHeight;

			if (containerWidth / containerHeight > videoAspectRatio) {
				displayedVideoWidth = containerHeight * videoAspectRatio
				displayedVideoHeight = containerHeight;
			} else {
				displayedVideoWidth = containerWidth;
				displayedVideoHeight = containerWidth / videoAspectRatio;
			}
			buttonContainerSize = {width: displayedVideoWidth, height: displayedVideoHeight}
		};

		videoElement?.addEventListener("loadedmetadata", updateButtonContainerSize);
		window.addEventListener("resize", updateButtonContainerSize);

		return () => {
			videoElement?.removeEventListener("loadedmetadata", updateButtonContainerSize);
			window.removeEventListener("resize", updateButtonContainerSize);
			unsubscribe
		}

	});
</script>

<div id="main-container">
	{#if isSafari}
	<div id="video-container" style={`width: ${buttonContainerSize.width}px; height: ${buttonContainerSize.height}px; background-image: url(${videoUrl}); background-size: 100% 100%; background-position: center;`}></div>
	{:else}
	<video src={videoUrl} muted disablepictureinpicture></video>
	{/if}
	<div id="button-container" style={`width: ${buttonContainerSize.width}px; height: ${buttonContainerSize.height}px;`}>
		<button on:click={returnToMainMenu} />
	</div>
</div>

<style>
	#main-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(25, 25, 25, 1);;

	}
    #video-container {
        position: absolute;
        top: 0;
        left: 0;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 3;
    }

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        z-index: 2;
		background-color: rgba(25, 25, 25, 1);;
    }
	button {
		background: url('/GF-backward.png') no-repeat center center / contain;
		border: none;
		cursor: pointer;
		width: 9%;
		height: 9%;
		display: block;
		object-fit: contain;
		padding: 0;
		background-color: transparent;
		position: absolute;
		bottom: 3%;
		right: 1%;
		z-index: 10;
	}

	#button-container {
		position: relative;
	}
</style>
