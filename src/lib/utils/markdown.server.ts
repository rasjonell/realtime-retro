type Path = 'all' | 'blog' | 'til';

type InitalImportedMarkdown = {
	metadata: {
		date: string;
		tags: string;
		title: string;
		abstract: string;
	};
};

export type ParsedMarkdown = {
	date: string;
	tags: string[];
	fileName: string;
	abstract: string;
};

function buildFileName(fullPath: string) {
	const last = fullPath.split('/').at(-1)!;
	return last.substring(0, last.length - 3);
}

function importMarkdown(path: Path) {
	if (path === 'til') {
		return [import.meta.glob('../../routes/til/*.md')];
	}

	if (path === 'blog') {
		return [import.meta.glob('../../routes/blog/*.md')];
	}

	return [import.meta.glob('../../routes/til/*.md'), import.meta.glob('../../routes/blog/*.md')];
}

export function getParsedMarkdowns(path: Path) {
	const files = importMarkdown(path);

	return Promise.all(
		files.flatMap((info, i) =>
			Object.entries(info).map(async ([fullPath, importer]) => {
				const data = (await importer()) as InitalImportedMarkdown;
				return {
					...data.metadata,
					fileName: buildFileName(fullPath),
					tags: data.metadata.tags.split(','),
					source: path === 'all' ? ['til', 'blog'][i] : path,
				};
			}),
		),
	);
}

export async function getParsedMarkdownsByTag(path: Path, tag: string) {
	const data = await getParsedMarkdowns(path);
	return data.filter((data) => data.tags.some((slug) => slug === tag));
}
