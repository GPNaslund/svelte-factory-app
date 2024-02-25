<script>
	import { videoUrls } from '$lib/stores';
	import { onMount } from 'svelte';
	import VideoLinkButton from './VideoLinkButton.svelte';

	/**
	 * @type {string}
	 */
	let menuUrl;
	/**
	 * @type {boolean}
	 */
	let isSafari;

	let buttonContainerSize = {width: 0, height: 0}
	const videoAspectRatio = 16 / 9;

	$: {
		const menuObj = $videoUrls.find((urlObj) => urlObj.name === 'Menue');
		menuUrl = menuObj ? menuObj.url : null;
	}

	onMount(() => {
		const videoElement = document.querySelector("video");
		
		videoElement?.play();
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
		}

	})
</script>

<div id="main-container">
		{#if isSafari}
		<div id="video-background" style={`width: ${buttonContainerSize.width}px; height: ${buttonContainerSize.height}px; background-image: url(${menuUrl}); background-size: contain; background-position: center;`}></div>
		{:else}
		<video src={menuUrl} loop disablepictureinpicture></video>
		{/if}
		<div id="button-container" style={`width: ${buttonContainerSize.width}px; height: ${buttonContainerSize.height}px`}>
			<VideoLinkButton
				videoName="ControlCenter"
				tooltip="Control center"
				tooltipPos="right"
				top="50"
				left="6"
			/>
			<VideoLinkButton
				videoName="LoadingStation"
				tooltip="Loading station"
				tooltipPos="top"
				top="72"
				left="12"
			/>

			<VideoLinkButton
				videoName="ElectrodeMillingCell"
				tooltip="Electrode milling cell"
				tooltipPos="left"
				top="44.5"
				left="18"
			/>

			<VideoLinkButton 
				videoName="EDMCell" 
				tooltip="EDM cell" 
				tooltipPos="left" 
				top="45.5" 
				left="41.5" 
			/>

			<VideoLinkButton
				videoName="MillingCell"
				tooltip="Milling cell"
				tooltipPos="left"
				top="47"
				left="66.5"
			/>

			<VideoLinkButton
				videoName="WashingCell"
				tooltip="Washing cell"
				tooltipPos="bottom"
				top="76"
				left="92"
			/>

			<VideoLinkButton
				videoName="MeasuringCell"
				tooltip="Measuring cell"
				tooltipPos="left"
				top="91.5"
				left="82"
			/>

			<VideoLinkButton
				videoName="MaterialStorage"
				tooltip="Material storage"
				tooltipPos="left"
				top="94"
				left="49"
			/>

			<VideoLinkButton
				videoName="PreparationStation"
				tooltip="Preparation station"
				tooltipPos="left"
				top="92"
				left="22"
			/>

			<VideoLinkButton
				videoName="WSMDashboard"
				tooltip="Cell status"
				tooltipPos="right"
				top="6"
				left="49"
			/>
		</div>
</div>

<style>
	#main-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1;
	}

	#button-container {
		position: relative;
		z-index: 5;
	}

	#video-background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}
	
	video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		z-index: 1;
	}

</style>
