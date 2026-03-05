<script lang="ts">
	import Shop from '$lib/components/Shop.svelte';
	import { shopStore } from '$lib/shopStore.svelte';
	import type { ShopData } from '$lib/types';

	let selectedShop: ShopData | undefined = $state(undefined);

	const imageItems = $derived(shopStore.shopList.filter((item: ShopData) => item.logo_filename));

	function popupHandler(shop: ShopData) {
		selectedShop = shop;
	}

	function closeHandler() {
		selectedShop = undefined;
	}

	function handleImageError(e: Event) {
		const target = e.target as HTMLImageElement;
		target.parentElement?.remove();
	}
</script>

<div class="head"></div>
<div class="images">
	<div class="container">
		<div class="image-grid">
			{#each imageItems as item, i (i)}
				<div class="image-item">
					<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						src={item.logo_filename}
						alt={item.name}
						loading="lazy"
						onclick={() => popupHandler(item)}
						onerror={handleImageError}
					/>
				</div>
			{/each}
		</div>

		{#if selectedShop}
			<Shop shop={selectedShop} onclose={closeHandler} />
		{/if}
	</div>
</div>

<style>
	.head {
		padding: 0 16px;
		background-color: var(--primary-color);
		box-sizing: border-box;
		height: 44px;
	}

	.images {
		width: 100%;
		height: calc(100% - 44px);
		overflow: auto;
	}

	.container {
		padding: 8px;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
	}

	.image-item img {
		width: 100%;
		height: 164px;
		object-fit: cover;
		cursor: pointer;
	}
</style>
