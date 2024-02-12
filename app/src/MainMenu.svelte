<script>
	import { videoUrls } from '$lib/stores';
	import { onMount } from 'svelte';
	import VideoLinkButton from './VideoLinkButton.svelte';

	/**
	 * @type {string}
	 */
	let menuUrl;

	$: {
		const menuObj = $videoUrls.find((urlObj) => urlObj.name === 'Menue');
		menuUrl = menuObj ? menuObj.url : null;
	}

	onMount(() => {
		let videoElement = document.querySelector("video");
		videoElement?.play();
	})
</script>

<div>
	<video src={menuUrl} loop playsinline disablepictureinpicture></video>
	<VideoLinkButton
		videoName="ControlCenter"
		tooltip="Control center"
		tooltipPos="right"
		top="49"
		left="6"
	/>

	<VideoLinkButton
		videoName="LoadingStation"
		tooltip="Loading station"
		tooltipPos="left"
		top="73"
		left="12"
	/>

	<VideoLinkButton
		videoName="ElectrodeMillingCell"
		tooltip="Electrode milling cell"
		tooltipPos="left"
		top="44"
		left="19"
	/>

	<VideoLinkButton 
		videoName="EDMCell" 
		tooltip="EDM cell" 
		tooltipPos="left" 
		top="45" 
		left="42.5" 
	/>

	<VideoLinkButton
		videoName="MillingCell"
		tooltip="Milling cell"
		tooltipPos="left"
		top="46.5"
		left="67"
	/>

	<VideoLinkButton
		videoName="WashingCell"
		tooltip="Washing cell"
		tooltipPos="bottom"
		top="75"
		left="92"
	/>

	<VideoLinkButton
		videoName="MeasuringCell"
		tooltip="Measuring cell"
		tooltipPos="left"
		top="91"
		left="83"
	/>

	<VideoLinkButton
		videoName="MaterialStorage"
		tooltip="Material storage"
		tooltipPos="left"
		top="94"
		left="49.5"
	/>

	<VideoLinkButton
		videoName="PreparationStation"
		tooltip="Preparation station"
		tooltipPos="left"
		top="91"
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

<style>
	div {
		width: 100%;
		height: 100%;
	}
	
	video {
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
</style>
