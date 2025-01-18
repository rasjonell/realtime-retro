<script lang="ts">
	import { scale } from 'svelte/transition';

	import type { CursorPosition } from '$lib/partykit/Socket';

	export let data: CursorPosition;
</script>

<div
	class="click-circle-container"
	transition:scale={{ duration: 200, start: 0.5 }}
	style={`left: ${data.x - 27}px; top: ${data.y - 27}px`}
/>

<style>
	.click-circle-container {
		z-index: 99;
		position: absolute;
		width: 50px;
		height: 50px;
		background: rgb(115, 115, 115);
		background: radial-gradient(
			circle,
			rgba(115, 115, 115, 0.6) 0%,
			rgba(139, 139, 139, 0.25) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		border-radius: 50%;
		filter: blur(5px);
	}
</style>
