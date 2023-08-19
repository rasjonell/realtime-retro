---
date: 2023-08-19
title: Smooth Cursor Transitions with Svelte Tweened Stores
tags: svelte,real-time,state-management
---
Have you noticed those real-time cursor updates while visiting a page on this website? They're pretty neat, right? Well, I'm about to let you in on a little behind-the-scenes secret that makes those updates incredibly smooth. We want to show changes in real-time without overwhelming the website with updates, however not to be a burden on the network I throttle `mousemove` event broadcasting, but that results in jumpy cursor position updates. Let's see how we can mimic real-time rendering while only sending updates periodically.

This website takes advantage of Svelte's super-handy feature called [tweened stores](https://svelte.dev/docs/svelte-motion#tweened) for animations. These stores are fantastic for making things move gracefully, but they work best with primitive types like numbers. Our cursor positions, however, are a bit more complex. And that's where our custom-made solution comes into play. Svelte let's you use custom interpolators which are triggered before updating the store. We receive the current and the next state and generate a smooth transition between them.

```typescript
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
```

And to use it with my store I have to pass it to the `tweened` function:

```typescript
const cursorPositionStore: CursorPositionStore = tweened(new Map<string, CursorPosition>(), {
  duration: 200,
  interpolate: interpolateCoordinates,
});
```

Based on the easing function of your tweened store, the custom interpolator will be called with some `t` which is in the range `[0, 1]`.

0 being the closest to the initial state, and 1 being the final state.

So if the client gets notified about a user's cursor position change from `{x: 0, y: 0}` to `{x: 50, y: 50}`, the interpolator will be called with different `(t)`s, when it's `0.5` the resulting position will be: `{x: 25, y: 25}`. Repeating this process in 200 milliseconds(as specified above) we get smooth cursor position updates!
