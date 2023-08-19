import { getParsedMarkdownsByTag } from '$lib/utils/markdown.server';

import type { PageServerLoad } from './$types';

export const load = (async ({ params: { slug } }) => {
	const posts = await getParsedMarkdownsByTag('all', slug);
	return { posts, slug };
}) satisfies PageServerLoad;
