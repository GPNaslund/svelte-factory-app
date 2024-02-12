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

    onMount(async () => {
        await videoStore.initializeDB().catch(e => errorMessage = e.toString());
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
	<img src="/GFLOFIntro.png" id="loading-image" alt="Lights out factory cover" />
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

<style>

	#loading-container {
		width: 100%;
		height: 100%;
	}

	#loading-image {
		width: 100%;
		height: 100%;
		object-fit: fill;
	}

	#initialization-info {
		position: absolute;
		top: 60%;
		left: 12%;
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
		background-color: rgba(0, 108, 162, 255);
		border-color: rgba(0, 108, 162, 255);
		font-size: clamp(1rem, 2.5vw, 2rem);
		padding: 0.25em 1em;
        cursor: pointer;
	}
</style>