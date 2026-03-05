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
		<div class="shop-list-category">{`地域：「${queryCategory}」`}</div>
	{/if}
	{#if queryTag}
		<div class="shop-list-category">{`タイプ：「${queryTag}」`}</div>
	{/if}

	{#each list as item, index (index)}
		<div class="shop">
			<ShopListItem data={item} {popupHandler} {queryCategory} />
		</div>
	{/each}

	{#if hasMore}
		<div class="loader">場所一覧を読み込み中です...</div>
	{/if}

	{#if selectedShop}
		<Shop shop={selectedShop} onclose={closeHandler} />
	{/if}
</div>

<style>
	.shop-list {
		color: #555555;
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
	}

	.shop {
		border-bottom: 1px solid #eeeeee;
		padding: 16px;
		font-size: 12px;
		position: relative;
	}

	.shop:nth-child(even) {
		background-color: #f7f7f7;
	}

	.shop-list-category {
		margin: 20px 10px;
		font-size: 18px;
		display: flex;
	}

	.loader {
		width: 100%;
		height: 200px;
		text-align: center;
		position: relative;
		top: 100px;
	}
</style>
