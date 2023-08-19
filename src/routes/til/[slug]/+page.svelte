<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article>
	<h4>{data.title}</h4>
	<p>
		Published: {new Date(data.date).toLocaleDateString('en-Us', { dateStyle: 'long' })}
		<br />
		{#each data.tags as tag, i}
			<a class="link" href={`/tags/${tag}`}>#{tag}</a>{i !== data.tags.length - 1 ? ', ' : ''}
		{/each}
	</p>
	<svelte:component this={data.content} />
</article>

<style>
	h4 {
		margin: 1.5rem 0 0.5rem 0;
		text-align: center;
	}

	p {
		text-align: end;
		margin-bottom: 0;
		padding-bottom: 0;
	}
</style>
