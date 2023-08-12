import type { PageServerLoad } from './$types';

export const load = (async () => {
	const filesMap = import.meta.glob('./*.md');
	const posts = await Promise.all(
		Object.entries(filesMap).map(async ([fileName, importer]) => {
			const postData = (await importer()) as {
				metadata: { title: string; date: string; abstract: string };
			};

			return { fileName: fileName.substring(0, fileName.length - 3), metadata: postData.metadata };
		}),
	);

	return { posts };
}) satisfies PageServerLoad;
