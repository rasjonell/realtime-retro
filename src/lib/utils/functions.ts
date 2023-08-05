export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 350) {
	let timeoutId: number;

	return function (this: any, ...args: Parameters<T>): void {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
}

export function throttle<T extends (...args: any[]) => void>(fn: T, wait: number = 50) {
	let lastFn: number;
	let lastTime: number;
	let inThrottle: boolean;

	return function (this: any, ...args: Parameters<T>) {
		const context = this;

		if (!inThrottle) {
			fn.apply(context, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(() => {
				if (Date.now() - lastTime >= wait) {
					fn.apply(context, args);
					lastTime = Date.now();
				}
			}, Math.max(wait - (Date.now() - lastTime), 0));
		}
	};
}
