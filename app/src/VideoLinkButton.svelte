<script>
	import { onMount } from 'svelte';
	import { videoToDisplay, videoUrls } from '$lib/stores';

	/**
	 * @type {boolean}
	 */
	let hasTouch;
	/**
	 * @type {boolean}
	 */
	let showTooltip;

	/**
	 * @type {string}
	 */
	export let tooltip;
	/**
	 * @type {string}
	 */
	export let tooltipPos;
	/**
	 * @type {string}
	 */
	export let videoName;

    /**
	 * @type {string}
	 */
     export let top;

    /**
	 * @type {string}
	 */
     export let left;

	/**
	 * @type {string}
	 */
	let tooltipStyle;

	onMount(() => {
		hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		tooltipStyle = computeTooltipStyle(tooltipPos);
	});

	/**
	 * @param {string} position
	 */
	function computeTooltipStyle(position) {
		const ratio = window.innerWidth / window.innerHeight;
		let style = '';

		switch (position) {
			case 'left':
			case 'right':
				style += `top: ${ratio < 1.8 ? `-${ratio * 5}%` : '0%'};`;
				style +=
					position === 'left'
						? `right: ${!hasTouch ? '135%' : '120%'};`
						: `left: ${!hasTouch ? '135%' : '120%'};`;
				break;
			case 'top':
				style += `bottom: ${!hasTouch ? '135%' : '120%'}; left: 50%; transform: translateX(-50%);`;
				break;
			case 'bottom':
				style += `top: ${!hasTouch ? '135%' : '120%'}; left: 50%; transform: translateX(-50%);`;
				break;
		}
		return style;
	}



    function handleClick() {
        const videoObj = $videoUrls.find(obj => obj.name === videoName);
        const currentVideoUrl = videoObj ? videoObj.url : '';
        videoToDisplay.set(currentVideoUrl);
    }
    
</script>

<div style="position: absolute; top: {top}%; left: {left}%;">
	<button
		on:mouseover={() => !hasTouch && (showTooltip = true)}
		on:mouseleave={() => !hasTouch && (showTooltip = false)}
		on:focus={() => !hasTouch && (showTooltip = true)}
		on:click={handleClick}
	/>
	<span
		class="tooltip"
		class:tooltip-arrow-left={tooltipPos === 'left' && !hasTouch}
		class:tooltip-arrow-right={tooltipPos === 'right' && !hasTouch}
		class:tooltip-arrow-top={tooltipPos === 'top' && !hasTouch}
		class:tooltip-arrow-bottom={tooltipPos === 'bottom' && !hasTouch}
		style="{tooltipStyle} opacity: {showTooltip || hasTouch
			? '1'
			: '0'}; background-color: {hasTouch ? 'transparent' : '#00629b'};"
	>
		{tooltip}
	</span>
</div>

<style>
	div {
		width: auto;
		height: auto;
		max-width: 2vw;
		max-height: 2vw;
		background-position: center;
		background-size: cover;
		display: inline-block;
	}

	button {
		background: url('/blue-plus-small.png') no-repeat center center / contain;
		border: none; 
		cursor: pointer;
		width: 2vw;
		height:  2vw;
		display: block;
		object-fit: contain;
		z-index: 4;
		padding: 0; 
		background-color: transparent;
	}

	.tooltip {
		position: absolute;
		opacity: 0;
		transition: opacity 0.3s ease-in;
		padding: 0.5vh 0.5vw;
		border-radius: 3px;
		color: white;
		background-color: #00629b;
		z-index: 1;
		white-space: nowrap;
		user-select: none;
		font-size: calc(0.7vw + 0.7vh + 0.5vmin);
	}

	@media (max-aspect-ratio: 1080/600) {
		span {
			font-size: calc(0.6vw + 0.6vh + 0.4vmin);
		}
	}

	/* Tooltip arrow styles */
	.tooltip-arrow-left::after {
		content: ' ';
		position: absolute;
		top: 50%;
		left: 100%;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent transparent #00629b;
	}

	.tooltip-arrow-right::after {
		content: ' ';
		position: absolute;
		top: 50%;
		right: 100%;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent #00629b transparent transparent;
	}

	.tooltip-arrow-top::after {
		content: ' ';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: #00629b transparent transparent transparent;
	}

	.tooltip-arrow-bottom::after {
		content: ' ';
		position: absolute;
		bottom: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent #00629b transparent;
	}
</style>
