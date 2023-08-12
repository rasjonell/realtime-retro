import PartySocket from 'partysocket';
import { tweened, type Tweened } from 'svelte/motion';
import { writable, type Writable } from 'svelte/store';

import { EventListeners } from './EventListeners';
import type { Message } from '$lib/partykit/index.server';
import { interpolateCoordinates } from '$lib/utils/motion';

export type CursorPosition = { x: number; y: number };
export type CursorActionStore = Writable<Set<CursorPosition>>;
export type CursorPositionStore = Tweened<Map<string, CursorPosition>>;

const host = import.meta.env.VITE_PK_HOST;
const name = import.meta.env.VITE_PK_NAME;
const username = import.meta.env.VITE_PK_USERNAME;
const HOST = import.meta.env.DEV ? 'localhost:1999' : `${name}.${username}.${host}`;

const stores = new Map<string, Tweened<Map<string, CursorPosition>>>();

export const Socket = {
	init,
};

function init(room: string): {
	socket: PartySocket;
	cursorActionStore: CursorActionStore;
	cursorPositionStore: CursorPositionStore;
} {
	if (room === '') {
		room = 'home';
	}

	const cursorPositionStore: CursorPositionStore = tweened(new Map<string, CursorPosition>(), {
		duration: 200,
		interpolate: interpolateCoordinates,
	});

	const cursorActionStore: CursorActionStore = writable(new Set());

	stores.set(room, cursorPositionStore);

	const socket = new PartySocket({
		room,
		host: HOST,
	});

	socket.addEventListener('close', () => EventListeners.deinit);
	socket.addEventListener('open', () => EventListeners.init(socket));

	socket.addEventListener('message', (msg) => {
		const parsedMessage = JSON.parse(msg.data) as Message;

		switch (parsedMessage.type) {
			case 'connected':
				cursorPositionStore.update((s) => {
					parsedMessage.data.connections.forEach((id) => s.set(id, { x: 0, y: 0 }));
					return s;
				});
				break;

			case 'disconnected':
				cursorPositionStore.update((s) => {
					s.delete(parsedMessage.data.id);
					return s;
				});
				break;

			case 'newConnection':
				cursorPositionStore.update((s) => s.set(parsedMessage.data.id, { x: 0, y: 0 }));
				break;

			case 'cursorUpdated':
				cursorPositionStore.update((s) => s.set(parsedMessage.senderId, parsedMessage.data));
				break;

			case 'clicked':
				let data: CursorPosition | undefined;

				cursorActionStore.update((s) => {
					if ([...s].find(({ x, y }) => x === parsedMessage.data.x && parsedMessage.data.y === y)) {
						return s;
					}

					data = parsedMessage.data;
					return s.add(data);
				});

				setTimeout(() => {
					cursorActionStore.update((s) => {
						if (data) {
							s.delete(data);
						}
						return s;
					});
				}, 200);

				break;

			default:
				console.warn('unknown message type:', parsedMessage);
				break;
		}
	});

	return { socket, cursorPositionStore, cursorActionStore };
}
