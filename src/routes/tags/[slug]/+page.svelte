<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: posts = data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
</script>

<h4 class="title">Posts Tagged: #{data.slug}</h4>

<ul class="tree-view">
	{#each posts as post, i}
		<li>
			<a class="link" href={`/${post.source}/${post.fileName}`}>{post.title}</a>
			- {new Date(post.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
			<ul>
				<li>
					{#each post.tags as tag, i}
						<a class="link" href={`/tags/${tag}`}>#{tag}</a>{i !== post.tags.length - 1 ? ', ' : ''}
					{/each}
				</li>
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
