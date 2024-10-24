<script lang="ts">
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();

	function close() {
		dialog.close();
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click|self={close} on:close={() => (showModal = false)}>
	<div class="window" style="width: 300px; padding: 3px;">
		<div class="title-bar">
			<div class="title-bar-text"><slot class="title-bar-text" name="header" /></div>
			<div class="title-bar-controls">
				<button aria-label="Minimize" on:click={close} />
				<button aria-label="Close" on:click={close} />
			</div>
		</div>
		<div class="window-body">
			<slot />
		</div>
	</div>
</dialog>

<style>
	dialog {
		padding: 0;
		border: none;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
