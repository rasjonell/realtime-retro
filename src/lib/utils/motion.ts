import type { CursorPosition } from '$lib/partykit/Socket';

export const interpolateCoordinates =
	(a: Map<string, CursorPosition>, b: Map<string, CursorPosition>) =>
	(t: number): Map<string, CursorPosition> => {
		const resultingMap = new Map(b);

		for (const [id, { x, y }] of a.entries()) {
			const correspondingEntry = b.get(id);
			if (correspondingEntry && (correspondingEntry.x !== x || correspondingEntry.y !== y)) {
				resultingMap.set(id, {
					x: calculateIntermediatePosition(x, correspondingEntry.x, t),
					y: calculateIntermediatePosition(y, correspondingEntry.y, t),
				});
			}
		}

		return resultingMap;
	};

// 0 <= `t` <= 1
function calculateIntermediatePosition(prev: number, final: number, t: number): number {
	const update = (final - prev) * t;
	return prev + update;
}
