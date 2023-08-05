import type { PartyKitServer } from 'partykit/server';

const MessageTypes = ['newConnection', 'disconnected', 'cursorUpdated'];

export type Message = { senderId: string } & (
	| { type: 'disconnected'; data: { id: string } }
	| { type: 'newConnection'; data: { id: string } }
	| { type: 'connected'; data: { connections: string[] } }
	| { type: 'cursorUpdated'; data: { x: number; y: number } }
);

export default {
	onConnect(ws, room) {
		for (const [id, connection] of room.connections.entries()) {
			if (id === ws.id) {
				const msg: Message = {
					senderId: ws.id,
					type: 'connected',
					data: {
						connections: Array.from(room.connections.keys()).filter((id) => id !== ws.id),
					},
				};

				ws.send(JSON.stringify(msg));
				continue;
			}

			const msg: Message = {
				senderId: ws.id,
				data: { id: ws.id },
				type: 'newConnection',
			};

			connection.send(JSON.stringify(msg));
		}
	},

	onClose(ws, room) {
		for (const [id, connection] of room.connections.entries()) {
			if (id === ws.id) {
				continue;
			}

			const msg: Message = {
				senderId: ws.id,
				data: { id: ws.id },
				type: 'disconnected',
			};

			connection.send(JSON.stringify(msg));
		}
	},

	onMessage(msg, ws, room) {
		for (const [id, connection] of room.connections.entries()) {
			if (id === ws.id || typeof msg !== 'string') continue;

			const parsedMsg = JSON.parse(msg) as Message;
			if (!MessageTypes.includes(parsedMsg.type)) {
				throw new Error(`unknown message type: ${parsedMsg.type}`);
			}

			// attaching sender's id and broadcasting it to connected clients
			connection.send(JSON.stringify({ ...parsedMsg, senderId: ws.id } as Message));
		}
	},
} satisfies PartyKitServer;
