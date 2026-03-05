<script lang="ts">
	import { isOpen } from '$lib/isOpen';
	import type { ShopData } from '$lib/types';

	let {
		shops,
		selectedArea = $bindable(''),
		selectedCategory = $bindable(''),
		openNow = $bindable(false)
	}: {
		shops: ShopData[];
		selectedArea: string;
		selectedCategory: string;
		openNow: boolean;
	} = $props();

	function applyOpenFilter(list: ShopData[]): ShopData[] {
		if (!openNow) return list;
		return list.filter((s) => isOpen(s.hours_structured) === true);
	}

	// 地域の件数算出用: カテゴリ + 営業中を適用
	const shopsForAreaCount = $derived(() => {
		let list = shops;
		if (selectedCategory) {
			list = list.filter((s) => {
				if (!s.categories) return false;
				return s.categories.split(',').map((t) => t.trim()).includes(selectedCategory);
			});
		}
		return applyOpenFilter(list);
	});

	// カテゴリの件数算出用: 地域 + 営業中を適用
	const shopsForCatCount = $derived(() => {
		let list = shops;
		if (selectedArea) {
			list = list.filter((s) => s.area === selectedArea);
		}
		return applyOpenFilter(list);
	});

	const areaList = $derived(() => {
		const filtered = shopsForAreaCount();
		const counts = new Map<string, number>();
		for (const shop of filtered) {
			if (!shop.area) continue;
			counts.set(shop.area, (counts.get(shop.area) || 0) + 1);
		}
		// 全店舗からユニークな地域リストを取得（0件でも表示）
		const allAreas: string[] = [];
		for (const shop of shops) {
			if (shop.area && allAreas.indexOf(shop.area) === -1) {
				allAreas.push(shop.area);
			}
		}
		return allAreas.map((a) => ({ name: a, count: counts.get(a) || 0 }));
	});

	const categoryList = $derived(() => {
		const filtered = shopsForCatCount();
		const counts = new Map<string, number>();
		for (const shop of filtered) {
			if (!shop.categories) continue;
			for (const tag of shop.categories.split(',')) {
				const t = tag.trim();
				if (t) counts.set(t, (counts.get(t) || 0) + 1);
			}
		}
		const allCats: string[] = [];
		for (const shop of shops) {
			if (!shop.categories) continue;
			for (const tag of shop.categories.split(',')) {
				const t = tag.trim();
				if (t && allCats.indexOf(t) === -1) allCats.push(t);
			}
		}
		return allCats.map((c) => ({ name: c, count: counts.get(c) || 0 }));
	});

	const totalForArea = $derived(shopsForAreaCount().length);
	const totalForCat = $derived(shopsForCatCount().length);
</script>

<div class="filter-bar">
	<select
		class="filter-select"
		bind:value={selectedArea}
		aria-label="地域で絞り込み"
	>
		<option value="">全地域 ({totalForArea})</option>
		{#each areaList() as area}
			<option value={area.name}>{area.name} ({area.count})</option>
		{/each}
	</select>

	<select
		class="filter-select"
		bind:value={selectedCategory}
		aria-label="タイプで絞り込み"
	>
		<option value="">全タイプ ({totalForCat})</option>
		{#each categoryList() as cat}
			<option value={cat.name}>{cat.name} ({cat.count})</option>
		{/each}
	</select>

	<button
		class="filter-toggle"
		class:active={openNow}
		onclick={() => (openNow = !openNow)}
		aria-pressed={openNow}
	>
		営業中
	</button>
</div>

<style>
	.filter-bar {
		display: flex;
		gap: 6px;
		padding: 8px;
		background: var(--bg-color);
		border-bottom: 1px solid var(--muted-color);
		align-items: center;
		z-index: 10;
	}

	.filter-select {
		flex: 1;
		padding: 6px 8px;
		font-size: 13px;
		border: 1px solid var(--muted-color);
		border-radius: 6px;
		background: white;
		color: var(--text-color);
		appearance: auto;
		min-width: 0;
	}

	.filter-toggle {
		padding: 6px 12px;
		font-size: 13px;
		border: 2px solid var(--primary-color);
		border-radius: 20px;
		background: white;
		color: var(--primary-color);
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.15s ease;
		font-weight: 500;
	}

	.filter-toggle.active {
		background: var(--primary-color);
		color: white;
	}
</style>
