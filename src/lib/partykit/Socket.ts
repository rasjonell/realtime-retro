import PartySocket from 'partysocket';
import { tweened, type Tweened } from 'svelte/motion';

import { EventListeners } from './EventListeners';
import type { Message } from '$lib/partykit/index.server';
import { interpolateCoordinates } from '$lib/utils/motion';

export type CursorPosition = { x: number; y: number };

const host = 'localhost:1999';
const stores = new Map<string, Tweened<Map<string, CursorPosition>>>();

export const Socket = {
	init,
};

function init(room: string): { socket: PartySocket; store: Tweened<Map<string, CursorPosition>> } {
	if (room === '') {
		room = 'home';
	}

	const store = tweened(new Map<string, CursorPosition>(), {
		duration: 200,
		interpolate: interpolateCoordinates,
	});

	stores.set(room, store);

	const socket = new PartySocket({
		room,
		host,
	});

	socket.addEventListener('close', () => EventListeners.deinit);
	socket.addEventListener('open', () => EventListeners.init(socket));

	socket.addEventListener('message', (msg) => {
		const parsedMessage = JSON.parse(msg.data) as Message;

		switch (parsedMessage.type) {
			case 'connected':
				store.update((s) => {
					parsedMessage.data.connections.forEach((id) => s.set(id, { x: 0, y: 0 }));
					return s;
				});
				break;

			case 'disconnected':
				store.update((s) => {
					s.delete(parsedMessage.data.id);
					return s;
				});
				break;

			case 'newConnection':
				store.update((s) => s.set(parsedMessage.data.id, { x: 0, y: 0 }));
				break;

			case 'cursorUpdated':
				store.update((s) => s.set(parsedMessage.senderId, parsedMessage.data));
				break;

			default:
				console.warn('unknown message type:', parsedMessage);
				break;
		}
	});

	return { socket, store };
}
