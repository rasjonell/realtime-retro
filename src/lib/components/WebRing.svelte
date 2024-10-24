<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="web-ring-icon" on:click={() => dispatch('click')}>
	<div class="icon-container">
		<img src="/ie.svg" alt="IE Icon" class="icon" />
	</div>
	<span class="icon-label">Web Ring</span>
</div>

<style>
	.web-ring-icon {
		position: fixed;
		left: 1rem;
		top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}

	.icon-container {
		padding: 4px;
	}

	.icon {
		width: 3rem;
		height: 3rem;
	}

	.icon-container:hover {
		background-color: #000080;
		outline: 1px dotted #ffffff;
		outline-offset: -1px;
	}

	.icon-label {
		margin-top: 4px;
		padding: 0 2px;
		font-size: 0.875rem;
		color: white;
		text-shadow: 1px 1px #000000;
	}

	.web-ring-icon:hover .icon-label {
		background-color: #000080;
	}
</style>
