<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { isOpen } from '$lib/isOpen';
	import type { ShopData } from '$lib/types';

	let { data } = $props();

	let selectedArea = $state('');
	let selectedCategory = $state('');
	let openNow = $state(false);

	const filteredShops = $derived(() => {
		let shops = data.shopList;
		if (selectedArea) {
			shops = shops.filter((s: ShopData) => s.area === selectedArea);
		}
		if (selectedCategory) {
			shops = shops.filter((s: ShopData) => {
				if (!s.categories) return false;
				return s.categories.split(',').map((t: string) => t.trim()).includes(selectedCategory);
			});
		}
		if (openNow) {
			shops = shops.filter((s: ShopData) => isOpen(s.hours_structured) === true);
		}
		return shops;
	});
</script>

<div class="home-container">
	<FilterBar
		shops={data.shopList}
		bind:selectedArea
		bind:selectedCategory
		bind:openNow
	/>
	<div class="map-area">
		<Map data={filteredShops()} />
	</div>
</div>

<style>
	.home-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.map-area {
		flex: 1;
		min-height: 0;
	}
</style>
