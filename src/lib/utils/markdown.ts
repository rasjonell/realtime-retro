import { error } from '@sveltejs/kit';

export async function getMarkdownContent(path: 'til' | 'blog', fileName: string) {
	try {
		const post = await import(`../../routes/${path}/${fileName}.md`);

		const content = post.default;
		const { title, date, tags } = post.metadata;

		return {
			date,
			title,
			content,
			tags: tags.split(','),
		} as {
			content: any;
			date: string;
			title: string;
			tags: string[];
		};
	} catch {
		throw error(404, 'Entry Not Found');
	}
}
