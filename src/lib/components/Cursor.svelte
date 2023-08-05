<script lang="ts">
	import randomColor from 'randomcolor';
	import { fade } from 'svelte/transition';

	export let x: number;
	export let y: number;
	export let id: string;
	export let country: { code: string; name: string; emoji: string };
</script>

<div
	class="cursor-container"
	transition:fade={{ duration: 200 }}
	style={`left: ${x}px; top: ${y}px;`}
>
	<svg
		width="32px"
		height="32px"
		version="1.1"
		class="cursor"
		fill={randomColor()}
		viewBox="-10.5 0 32 32"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>{country.emoji} - {country.name}</title>
		<path
			d="M9.313 14.906v1.313h1.313v1.313h-3.969v2.656h1.313v2.656h1.344v2.656h-2.656v-2.656h-1.344v-2.656h-1.313v-1.313h-1.344v1.313h-1.313v1.344h-1.344v-14.594h1.344v1.313h1.313v1.344h1.344v1.313h1.313v1.344h1.344v1.313h1.313v1.344h1.344z"
		/>
	</svg>
</div>

<style>
	.cursor-container {
		z-index: 100;
		position: absolute;
	}

	path {
		stroke: #000000;
		stroke-width: 1px;
		stroke-linejoin: round;
	}
</style>
