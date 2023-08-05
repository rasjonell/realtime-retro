import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		sections: [
			{ path: '/', title: 'Home' },
			{ path: '/blog', title: 'Blog' },
			{ path: '/about', title: 'About' }
		]
	};
}) satisfies LayoutLoad;
