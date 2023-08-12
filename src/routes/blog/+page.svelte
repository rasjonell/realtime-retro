<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const posts = data.posts.sort(
		(a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
	);
</script>

<h4 class="title">Personal Blog 🖌️</h4>

<ul class="tree-view">
	{#each posts as post, i}
		<li>
			<a class="link" href={`/blog/${post.fileName}`}>{post.metadata.title}</a>
			- {new Date(post.metadata.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
			<ul>
				<li>{post.metadata.abstract}</li>
			</ul>
		</li>
		{#if i !== posts.length - 1}
			<br />
		{/if}
	{/each}
</ul>

<style>
	.title {
		margin: 1rem 0;
	}

	.link {
		text-decoration: underline;
	}
</style>
