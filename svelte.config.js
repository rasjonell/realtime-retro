import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsvex({
			highlight: false,
			extensions: ['.md'],
		}),
		vitePreprocess(),
	],

	extensions: ['.svelte', '.md'],

	kit: {
		adapter: adapter(),
	},
};

export default config;
