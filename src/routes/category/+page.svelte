<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ShopData } from '$lib/types';

	let { data: pageData } = $props();

	// 地域リスト
	const areaList = $derived(() => {
		const areas: string[] = [];
		for (const shop of pageData.shopList) {
			if (areas.indexOf(shop.area) === -1) {
				areas.push(shop.area);
			}
		}
		return areas;
	});

	// カテゴリタグリスト（醸造所/飲める/買える）
	const tagList = $derived(() => {
		const tags: string[] = [];
		for (const shop of pageData.shopList) {
			if (!shop.categories) continue;
			for (const tag of shop.categories.split(',')) {
				const t = tag.trim();
				if (t && tags.indexOf(t) === -1) {
					tags.push(t);
				}
			}
		}
		return tags;
	});

	function handleAreaChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			goto(`/list?category=${target.value}`);
		}
	}

	function handleTagClick(tag: string) {
		goto(`/list?tag=${tag}`);
	}
</script>

<div class="head"></div>
<div class="category">
	<div class="container">
		<div class="category-item">
			<label for="area-select">地域から選ぶ</label>
			<select id="area-select" onchange={handleAreaChange}>
				<option value="">選択してください</option>
				{#each areaList() as area}
					<option value={area}>{area}</option>
				{/each}
			</select>
		</div>

		<div class="category-item">
			<label>タイプから選ぶ</label>
			<div class="tag-list">
				{#each tagList() as tag}
					<button class="tag-button" onclick={() => handleTagClick(tag)}>{tag}</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.head {
		padding: 0 16px;
		background-color: var(--primary-color);
		box-sizing: border-box;
		height: 44px;
		text-align: right;
	}

	.category {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: scroll;
		scrollbar-width: none;
	}

	.category::-webkit-scrollbar {
		display: none;
	}

	.container {
		margin: 0;
		padding: 24px;
		padding-bottom: 50px;
	}

	.category-item {
		display: flex;
		flex-direction: column;
		margin: 15px 10px;
	}

	.category-item > label {
		margin-bottom: 5px;
	}

	select {
		padding: 8px;
		font-size: 1rem;
		border: 1px solid #cccccc;
		border-radius: 4px;
	}

	.tag-list {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.tag-button {
		padding: 8px 16px;
		font-size: 1rem;
		border: 2px solid var(--primary-color);
		border-radius: 20px;
		background: white;
		color: var(--primary-color);
		cursor: pointer;
	}

	.tag-button:hover {
		background: var(--primary-color);
		color: white;
	}
</style>
