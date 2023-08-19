import { getParsedMarkdowns } from '$lib/utils/markdown.server';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const posts = await getParsedMarkdowns('til');
	return { posts };
}) satisfies PageServerLoad;
