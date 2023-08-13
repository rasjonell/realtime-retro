<script lang="ts">
	import { page } from '$app/stores';
	import { getCountry } from '$lib/utils/country';
	import Cursor from '$lib/components/Cursor.svelte';
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

	// Real-Time State Handlers
	let cursorAction: CursorActionStore;
	let currentPathname: string | undefined;
	let prevSocket: PartySocket | undefined;
	let cursorPosition: CursorPositionStore | undefined;

	page.subscribe((p) => {
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
	{#each [...$cursorPosition.entries()] as [id, { x, y }]}
		<Cursor {id} {x} {y} {country} />
	{/each}
{/if}

{#if $cursorAction}
	{#each [...$cursorAction] as data, i (i)}
		<ClickCircle {data} store={cursorAction} />
	{/each}
{/if}

<div class="layout-container">
	<div class="window window-container">
		<div class="title-bar">
			<div class="title-bar-text">
				www.gurgen.info {currentPathname ? `> ${currentPathname.split('/')[0]}` : ''}
			</div>
			<div class="title-bar-controls">
				<button aria-label="Help" on:click={openModal} />
			</div>
		</div>

		<menu role="tablist">
			{#each data.sections as section}
				<li
					role="tab"
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
			min-height: 30dvh;
			max-height: 70dvh;
		}
	}

	@media screen and (min-width: 650px) {
		.window-container {
			width: 60dvw;
			min-height: 30dvh;
			max-height: 70dvh;
		}
	}

	.window {
		overflow-y: scroll;
		min-height: fit-content;
		max-height: calc(100% - 50px);
	}
</style>
