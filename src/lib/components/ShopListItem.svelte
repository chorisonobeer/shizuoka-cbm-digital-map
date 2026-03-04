<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { makeDistanceLabelText } from '$lib/distance-label';
	import type { ShopData } from '$lib/types';

	let {
		data,
		popupHandler,
		queryCategory
	}: { data: ShopData; popupHandler: (shop: ShopData) => void; queryCategory: string | null } =
		$props();

	const distanceTipText = $derived(makeDistanceLabelText(data.distance));
	const category = $derived(data.area);
	const image = $derived(data.logo_filename);
	const isCategoryPage = $derived(!!queryCategory);

	function clickHandler() {
		popupHandler(data);
	}
</script>

<div class="shop-link">
	<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
	<h2 class="shop-title" style="word-break: break-all" onclick={clickHandler}>
		{data.name}
	</h2>
	<div class="tag-box">
		{#if !isCategoryPage}
			<span class="nowrap">
				<a href={`/list?category=${category}`}>
					<span class="category">{category}</span>
				</a>
			</span>
		{/if}
		{#if distanceTipText}
			<span class="nowrap"><span class="distance">現在位置から {distanceTipText}</span></span>
		{/if}
	</div>

	<div style="margin: 10px 10px 10px 0">
		{#if image}
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<img src={image} alt={data.name} onclick={clickHandler} />
		{/if}
	</div>

	<div
		class="right"
		onclick={clickHandler}
		onkeydown={clickHandler}
		role="button"
		tabindex="0"
	>
		<ChevronRight size={40} color="#CCCCCC" />
	</div>
</div>

<style>
	.shop-link {
		display: block;
		padding: 0;
		color: #555555;
		text-align: left;
		top: 0;
		left: 0;
		background-color: transparent;
		border: none;
		width: 100%;
	}

	.tag-box {
		max-width: 100%;
	}

	.tag-box > :global(span) {
		display: inline-block;
	}

	.right {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		cursor: pointer;
	}

	h2 {
		font-size: 1.4rem;
		margin-bottom: 0;
		cursor: pointer;
	}

	.category,
	.distance {
		border-radius: 4px;
		color: #ffffff;
		padding: 4px;
		font-size: 0.8rem;
	}

	.category {
		background-color: #f5b041;
	}

	.category:hover {
		opacity: 0.8;
	}

	.distance {
		background-color: #41b0f5;
		margin-right: 10px;
	}

	.distance:hover {
		opacity: 0.8;
	}

	img {
		cursor: pointer;
		object-fit: cover;
		width: 100%;
		height: 150px;
	}
</style>
