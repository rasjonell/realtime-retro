import { throttle } from '$lib/utils/functions';

import type PartySocket from 'partysocket';
import type { Message } from './index.server';

const listners = new Map<keyof DocumentEventMap, Array<EventListener>>();

function init(socket: PartySocket): void {
	const clickListener = ((e: MouseEvent) => clickHandler(e, socket)) as EventListener;
	const mouseMoveListener = throttle((e: MouseEvent) =>
		mouseMoveHandler(e, socket),
	) as EventListener;

	document.addEventListener('click', clickListener);
	document.addEventListener('mousemove', mouseMoveListener);
	listners.set('mousedown', [clickListener]);
	listners.set('mousemove', [mouseMoveListener]);
}

function deinit(): void {
	for (const [event, fns] of listners.entries()) {
		for (const fn of fns) {
			document.removeEventListener(event, fn);
		}
	}
}

function mouseMoveHandler(e: MouseEvent, socket: PartySocket): void {
	const msg: Omit<Message, 'senderId'> = {
		type: 'cursorUpdated',
		data: { x: e.clientX, y: e.clientY },
	};

	socket.send(JSON.stringify(msg));
}

function clickHandler(e: MouseEvent, socket: PartySocket): void {
	const msg: Omit<Message, 'senderId'> = {
		type: 'clicked',
		data: { x: e.clientX, y: e.clientY },
	};

	socket.send(JSON.stringify(msg));
}

export const EventListeners = {
	init,
	deinit,
	listners,
};
