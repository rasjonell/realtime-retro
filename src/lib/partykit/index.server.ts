import type { PartyKitServer } from 'partykit/server';

const MessageTypes = ['newConnection', 'disconnected', 'cursorUpdated', 'connected', 'clicked'];

export type Message = { senderId: string } & (
	| { type: 'disconnected'; data: { id: string } }
	| { type: 'newConnection'; data: { id: string } }
	| { type: 'clicked'; data: { x: number; y: number } }
	| { type: 'connected'; data: { connections: string[] } }
	| { type: 'cursorUpdated'; data: { x: number; y: number } }
);

export default {
	onConnect(ws, room) {
		const msg: Message = {
			senderId: ws.id,
			data: { id: ws.id },
			type: 'newConnection',
		};

		room.broadcast(JSON.stringify(msg), [ws.id]);
		ws.send(
			JSON.stringify({
				senderId: ws.id,
				type: 'connected',
				data: {
					connections: Array.from(room.connections.keys()).filter((id) => id !== ws.id),
				},
			} as Message),
		);
	},

	onClose(ws, room) {
		const msg: Message = {
			senderId: ws.id,
			data: { id: ws.id },
			type: 'disconnected',
		};

		room.broadcast(JSON.stringify(msg), [ws.id]);
	},

	onMessage(msg, ws, room) {
		if (typeof msg !== 'string') {
			return;
		}

		const parsedMsg = JSON.parse(msg) as Message;
		if (!MessageTypes.includes(parsedMsg.type)) {
			throw new Error(`unknown message type: ${parsedMsg.type}`);
		}

		room.broadcast(JSON.stringify({ ...parsedMsg, senderId: ws.id } as Message), [ws.id]);
	},
} satisfies PartyKitServer;
