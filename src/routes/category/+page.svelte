<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ShopData } from '$lib/types';

	let { data: pageData } = $props();

	const categoryList = $derived(() => {
		const categories: string[] = [];
		for (const shop of pageData.shopList) {
			if (categories.indexOf(shop.area) === -1) {
				categories.push(shop.area);
			}
		}
		return categories;
	});

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			goto(`/list?category=${target.value}`);
		}
	}
</script>

<div class="head"></div>
<div class="category">
	<div class="container">
		<div class="category-item">
			<label for="category-select">カテゴリから選ぶ</label>
			<select id="category-select" onchange={handleChange}>
				<option value="">選択してください</option>
				{#each categoryList() as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
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
</style>
