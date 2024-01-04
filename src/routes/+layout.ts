import type { LayoutLoad } from './$types';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();

export const load = (() => {
	return {
		sections: [
			{ path: '/', title: 'Home', tooltip: 'Home Page' },
			{ path: '/til', title: 'TIL', tooltip: 'Today I Learnt' },
			{ path: '/blog', title: 'Blog', tooltip: 'Personal Blog' },
			{ path: '/about', title: 'About', toolbar: 'About Me' },
		],
	};
}) satisfies LayoutLoad;
