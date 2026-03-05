<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ShopListItem from '$lib/components/ShopListItem.svelte';
	import Shop from '$lib/components/Shop.svelte';
	import { askGeolocationPermission } from '$lib/geolocation';
	import * as turf from '@turf/turf';
	import type { ShopData } from '$lib/types';

	let { data: pageData } = $props();

	let selectedShop: ShopData | undefined = $state(undefined);
	let list: ShopData[] = $state([]);
	let allData: ShopData[] = $state([]);
	let pageSize = $state(10);
	let hasMore = $state(true);

	const queryCategory = $derived(page.url.searchParams.get('category'));
	const queryTag = $derived(page.url.searchParams.get('tag'));

	async function sortByDistance(shopList: ShopData[]): Promise<ShopData[]> {
		const currentPosition = await askGeolocationPermission();
		if (currentPosition) {
			const from = turf.point(currentPosition);
			const sorted = shopList.map((shop) => {
				const lng = parseFloat(shop.longitude);
				const lat = parseFloat(shop.latitude);
				if (Number.isNaN(lng) || Number.isNaN(lat)) return shop;
				const to = turf.point([lng, lat]);
				const distance = turf.distance(from, to, { units: 'meters' as const });
				return { ...shop, distance };
			});
			sorted.sort((a, b) => {
				if (typeof a.distance !== 'number' || Number.isNaN(a.distance)) return 1;
				if (typeof b.distance !== 'number' || Number.isNaN(b.distance)) return -1;
				return a.distance - b.distance;
			});
			return sorted;
		}
		return shopList;
	}

	$effect(() => {
		let shops = pageData.shopList;
		if (queryCategory) {
			shops = shops.filter((s: ShopData) => s.area === queryCategory);
		}
		if (queryTag) {
			shops = shops.filter((s: ShopData) => {
				if (!s.categories) return false;
				return s.categories.split(',').map((t: string) => t.trim()).includes(queryTag);
			});
		}

		const orderBy = pageData.config?.orderby;
		if (orderBy === 'distance') {
			sortByDistance(shops).then((sorted) => {
				allData = sorted;
				list = sorted.slice(0, pageSize);
				hasMore = sorted.length > pageSize;
			});
		} else {
			allData = shops;
			list = shops.slice(0, pageSize);
			hasMore = shops.length > pageSize;
		}
	});

	function loadMore() {
		if (list.length >= allData.length) {
			hasMore = false;
			return;
		}
		const nextPage = pageSize + 10;
		list = allData.slice(0, nextPage);
		pageSize = nextPage;
	}

	function popupHandler(shop: ShopData) {
		selectedShop = shop;
	}

	function closeHandler() {
		selectedShop = undefined;
	}

	let scrollContainer: HTMLDivElement;

	function handleScroll() {
		if (!scrollContainer || !hasMore) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		if (scrollTop + clientHeight >= scrollHeight - 200) {
			loadMore();
		}
	}
</script>

<div
	class="shop-list"
	bind:this={scrollContainer}
	onscroll={handleScroll}
>
	{#if queryCategory}
		<div class="filter-label">地域：{queryCategory}</div>
	{/if}
	{#if queryTag}
		<div class="filter-label">タイプ：{queryTag}</div>
	{/if}

	<div class="card-list">
		{#each list as item, index (index)}
			<ShopListItem data={item} {popupHandler} {queryCategory} />
		{/each}
	</div>

	{#if hasMore}
		<div class="loader"><span class="spinner"></span></div>
	{/if}

	{#if selectedShop}
		<Shop shop={selectedShop} onclose={closeHandler} />
	{/if}
</div>

<style>
	.shop-list {
		height: 100%;
		overflow-y: auto;
		background: var(--bg-color, #f5f0e8);
		-webkit-overflow-scrolling: touch;
	}

	.filter-label {
		padding: 10px 16px 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: #6b7280;
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px 12px;
	}

	.loader {
		display: flex;
		justify-content: center;
		padding: 32px 0;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 3px solid #e5e7eb;
		border-top-color: var(--primary-color, #1a2e44);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
