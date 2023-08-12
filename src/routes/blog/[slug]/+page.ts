import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	try {
		const post = await import(`../${params.slug}.md`);
		const { title, date } = post.metadata;
		const content = post.default;

		return {
			date,
			title,
			content,
		} as {
			content: any;
			date: string;
			title: string;
		};
	} catch {
		throw error(404, 'Blog Entry Not Found');
	}
}) satisfies PageLoad;
