<script lang="ts">
	import '98.css';

	import { page } from '$app/stores';
	import { getCountry } from '$lib/utils/country';
	import Cursor from '$lib/components/Cursor.svelte';
	import WebRing from '$lib/components/WebRing.svelte';
	import ClickCircle from '$lib/components/ClickCircle.svelte';
	import DialogWindow from '$lib/components/DialogWindow.svelte';
	import { Socket, type CursorActionStore, type CursorPositionStore } from '$lib/partykit/Socket';

	import type PartySocket from 'partysocket';
	import type { LayoutData } from './$types';

	// Props
	export let data: LayoutData;

	// Modal State Handlers
	let showModal = false;
	function openModal() {
		showModal = true;
	}

	let showWebRingModal = false;
	function openWebRingModal() {
		showWebRingModal = true;
	}

	let showWebRingIcon = false;

	// Real-Time State Handlers
	let cursorAction: CursorActionStore;
	let currentPathname: string | undefined;
	let prevSocket: PartySocket | undefined;
	let cursorPosition: CursorPositionStore | undefined;

	page.subscribe((p) => {
		showWebRingIcon = p.url.pathname === '/';

		if (p.url.pathname.substring(1) === currentPathname) return;

		if (prevSocket) {
			prevSocket.close();
			prevSocket = undefined;
		}

		currentPathname = p.url.pathname.substring(1);
		const { cursorActionStore, cursorPositionStore, socket } = Socket.init(currentPathname);
		prevSocket = socket;
		cursorAction = cursorActionStore;
		cursorPosition = cursorPositionStore;
	});

	const country = getCountry();
</script>

{#if $cursorPosition}
	{#each [...$cursorPosition.values()] as { x, y }}
		<Cursor {x} {y} {country} />
	{/each}
{/if}

{#if $cursorAction}
	{#each [...$cursorAction] as data, i (i)}
		<ClickCircle {data} />
	{/each}
{/if}

<div class="layout-container">
	{#if showWebRingIcon}
		<WebRing on:click={openWebRingModal} />
	{/if}

	<div class="window window-container">
		<div class="title-bar">
			<div class="title-bar-text">
				www.gurgen.info {currentPathname ? `> ${currentPathname.split('/')[0]}` : ''}
			</div>
			<div class="title-bar-controls">
				<button aria-label="Maximize" on:click={openWebRingModal} />
				<button aria-label="Help" on:click={openModal} />
			</div>
		</div>

		<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
		<menu role="tablist">
			{#each data.sections as section}
				<li
					role="tab"
					title={section.tooltip}
					aria-selected={section.path.length === 1
						? $page.url.pathname === section.path
						: $page.url.pathname.startsWith(section.path)}
				>
					<a href={section.path}>{section.title}</a>
				</li>
			{/each}
		</menu>
		<div id="window-container" class="window" role="tabpanel">
			<div class="window-body">
				<slot />
			</div>
		</div>
	</div>
</div>

<DialogWindow bind:showModal>
	<span slot="header">Liking the website so far?</span>
	<p>it's made with PartyKit and 98.css</p>
	<p>
		Check out the <a href="https://github.com/rasjonell/realtime-retro" target="_blank"
			>source code</a
		>
	</p>
</DialogWindow>

<DialogWindow bind:showModal={showWebRingModal}>
	<span slot="header">Check Out Our Web Ring</span>
	<p>
		<a href="https://ծիր.հայ/" target="_blank">Ծիր.հայ</a> is a web ring where you can discover similar
		websites and join a community of connected sites.
	</p>

	<div class="status-bar">
		<a href="https://ծիր.հայ/նախորդ" class="status-bar-field"> ← Previous </a>
		<a href="https://ծիր.հայ/պատահական" class="status-bar-field"> 🎲 Random 🎲 </a>
		<a href="https://ծիր.հայ/յաջորդ" class="status-bar-field"> Next → </a>
	</div>
</DialogWindow>

<style>
	.layout-container {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	@media screen and (max-width: 650px) {
		.window-container {
			width: 90dvw;
			max-height: 70dvh;
		}
	}

	@media screen and (min-width: 650px) {
		.window-container {
			width: 60dvw;
			max-height: 70dvh;
		}
	}

	.window {
		overflow-y: scroll;
		max-height: calc(100% - 50px);
	}

	.status-bar {
		width: 100%;
		font-size: 1rem;
	}

	.status-bar-field {
		text-align: center;
	}
</style>
