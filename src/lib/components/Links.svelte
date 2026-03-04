<script lang="ts">
	import { Instagram, Twitter, Facebook, Globe } from 'lucide-svelte';
	import type { ShopData } from '$lib/types';

	let { data }: { data: ShopData } = $props();
</script>

<div class="links">
	{#if data.instagram && data.instagram !== '0'}
		<div class="link">
			<a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener">
				<Instagram size={20} />
			</a>
		</div>
	{/if}
	{#if data.twitter && data.twitter !== '0'}
		<div class="link">
			<a href={`https://twitter.com/${data.twitter}`} target="_blank" rel="noopener">
				<Twitter size={20} />
			</a>
		</div>
	{/if}
	{#if data.facebook && data.facebook !== '0'}
		<div class="link">
			<a href={`https://www.facebook.com/${data.facebook}`} target="_blank" rel="noopener">
				<Facebook size={20} />
			</a>
		</div>
	{/if}
	{#if data.web_url}
		<div class="link">
			<a href={data.web_url} target="_blank" rel="noopener">
				<Globe size={20} />
			</a>
		</div>
	{/if}
</div>

<style>
	.links {
		margin: 24px 0;
	}

	.link {
		display: inline;
		margin: 0 16px 0 0;
	}
</style>
