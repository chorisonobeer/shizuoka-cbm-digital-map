<script lang="ts">
	import ShopListItem from '$lib/components/ShopListItem.svelte';
	import Shop from '$lib/components/Shop.svelte';
	import { shopStore } from '$lib/shopStore.svelte';
	import { askGeolocationPermission } from '$lib/geolocation';
	import config from '$lib/config';
	import * as turf from '@turf/turf';
	import type { ShopData } from '$lib/types';

	let selectedShop: ShopData | undefined = $state(undefined);
	let list: ShopData[] = $state([]);
	let allData: ShopData[] = $state([]);
	let pageSize = $state(10);
	let hasMore = $state(true);

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
		const shops = shopStore.shopList;
		if (shops.length === 0) return;

		const orderBy = config?.orderby;
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
	<div class="card-list">
		{#each list as item, index (index)}
			<ShopListItem data={item} {popupHandler} queryCategory={null} />
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
		background: var(--bg-color);
		-webkit-overflow-scrolling: touch;
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
		border: 3px solid var(--muted-color);
		border-top-color: var(--primary-color);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
