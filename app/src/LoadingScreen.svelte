<script>
	import ErrorMessage from './ErrorMessage.svelte';
	import { showMainMenu } from '$lib/stores';
    import { videoStore } from '$lib/videoStore';
    import { onDestroy, onMount } from 'svelte';
	/**
	 * @type {String}
	 */
	let errorMessage = "";

	/**
	 * @type {Number}
	 */
	let videosLoadedValue;

	/**
	 * @type {Number}
	 */
	let videosToLoadValue;

	let containerVisible = false;

	let containerSize = {width: 0, height: 0}
	const imageAspectRatio = 16 / 9;


    onMount(async () => {

		const updateButtonContainerSize = () => {
			const container = document.querySelector("#loading-container");
			if (!container) return;

			// @ts-ignore
			const containerWidth = container.offsetWidth;
			// @ts-ignore
			const containerHeight = container.offsetHeight;
			let displayedVideoWidth, displayedVideoHeight;

			if (containerWidth / containerHeight > imageAspectRatio) {
				displayedVideoWidth = containerHeight * imageAspectRatio
				displayedVideoHeight = containerHeight;
			} else {
				displayedVideoWidth = containerWidth;
				displayedVideoHeight = containerWidth / imageAspectRatio;
			}
			containerSize = {width: displayedVideoWidth, height: displayedVideoHeight}
		};

		updateButtonContainerSize();
		containerVisible = true;
        await videoStore.initializeDB().catch(e => errorMessage = e.toString());
		window.addEventListener("resize", updateButtonContainerSize);

    })


	const unsubscribeVideosLoaded = videoStore.videosLoaded.subscribe(value => {
        videosLoadedValue = value;
    });

    const unsubscribeVideosToLoad = videoStore.videosToLoad.subscribe(value => {
        videosToLoadValue = value;
    });

    onDestroy(() => {
        unsubscribeVideosLoaded();
        unsubscribeVideosToLoad();
    });

	function handleClick() {
		if (videosLoadedValue == videosToLoadValue) {
			showMainMenu.set(true);
		}
	}

</script>

<div id="loading-container">
	<img src="/3R-LoM-Intro.png" id="loading-image" alt="Lights out factory cover" />
	{#if containerVisible}
	<div id="initialization-container" style={`width: ${containerSize.width}px; height: ${containerSize.height}px`}>
		<div id="initialization-info">
			{#if errorMessage}
				<ErrorMessage {errorMessage} />
			{/if}
			{#if !errorMessage}
				<div>{videosLoadedValue}/{videosToLoadValue} stations loaded..</div>
					<button
					on:click={handleClick}
					id="enter-factory-btn" 
					style:opacity={videosLoadedValue == videosToLoadValue ? '100%' : '50%'}>
					Enter Factory
				</button>
			{/if}
		</div>
	</div>
	{/if}
</div> 

<style>

	#loading-container {
		width: 100%;
		height: 100%;
		position: relative;
		top: 0;
		left: 0;
		background-color: rgba(25, 25, 25, 1);
	}

	#loading-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	#initialization-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	#initialization-info {
		position: absolute;
		top: 60%;
		left: 2.5%;
		z-index: 2;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2vh;
		font-size: clamp(1rem, 2.5vw, 2rem);
	}

	#enter-factory-btn {
		border-radius: 0px;
		color: white;
		background-color: rgba(255,85,34,255);
		border-color: rgba(255,85,34,255);
		font-size: clamp(1rem, 2.5vw, 2rem);
		padding: 0.25em 1em;
        cursor: pointer;
	}
</style>