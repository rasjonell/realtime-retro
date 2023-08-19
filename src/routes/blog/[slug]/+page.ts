import { getMarkdownContent } from '$lib/utils/markdown';

import type { PageLoad } from './$types';

export const load = (async ({ params: { slug } }) => {
	return getMarkdownContent('blog', slug);
}) satisfies PageLoad;
