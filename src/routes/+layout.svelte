<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Tabbar from '$lib/components/Tabbar.svelte';
	import About from '$lib/components/About.svelte';
	import InstallBanner from '$lib/components/InstallBanner.svelte';
	import Map from '$lib/components/Map.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { shopStore } from '$lib/shopStore.svelte';
	import { isOpen } from '$lib/isOpen';
	import type { ShopData } from '$lib/types';

	let { data, children } = $props();

	onMount(() => {
		shopStore.initialize(fetch);
	});

	// スプラッシュ: データ取得完了でフェードアウト
	$effect(() => {
		if (shopStore.isLoaded) {
			const splash = document.getElementById('splash');
			if (splash) {
				splash.classList.add('fade-out');
				setTimeout(() => splash.remove(), 600);
			}
		}
	});

	// フィルタ状態（レイアウトで保持して永続化）
	let selectedArea = $state('');
	let selectedCategory = $state('');
	let openNow = $state(false);

	const isHome = $derived(page.url.pathname === '/');

	const filteredShops = $derived(() => {
		let shops = shopStore.shopList;
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

<svelte:head>
	<title>{data.config?.title || 'Geolonia PWAマップ'}</title>
	<meta name="description" content={data.config?.description || ''} />
</svelte:head>

<div class="outer-container">
	<div class="inner-container">
		<About config={data.config} />
		<div class="app">
			<div class="app-body">
				<!-- ホーム用: FilterBar + Map（常時マウント、CSS表示制御） -->
				<div class="home-container" class:visible={isHome}>
					<FilterBar
						shops={shopStore.shopList}
						bind:selectedArea
						bind:selectedCategory
						bind:openNow
					/>
					<div class="map-area">
						<Map data={filteredShops()} visible={isHome} />
					</div>
				</div>

				<!-- 他ページ用: ルーティングコンテンツ -->
				{#if !isHome}
					{@render children()}
				{/if}
			</div>
			<div class="app-footer">
				<Tabbar />
			</div>
		</div>
	</div>
</div>

<InstallBanner />

<style>
	:global(*) {
		padding: 0;
		margin: 0;
		font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', 'メイリオ', Meiryo,
			'ＭＳ Ｐゴシック', sans-serif;
		font-size: 16px;
	}

	:global(a) {
		color: var(--accent-color, #3a6b8c);
		text-decoration: none;
	}

	:global(.small) {
		font-size: 0.8rem;
	}

	:global(.nowrap) {
		white-space: nowrap;
		margin-right: 8px;
		margin-bottom: 5px;
	}

	:global(img) {
		max-width: 100%;
		height: auto;
	}

	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		position: fixed;
		overflow: hidden;
	}

	.outer-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--background-image);
		background-size: cover;
	}

	.inner-container {
		padding: 0;
		width: 720px;
		height: 673px;
		max-height: 90%;
		position: relative;
	}

	.app {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 381px;
		height: 100%;
		border-radius: 20px;
		overflow: hidden;
		background-color: #ffffff;
		border: 3px solid #555555;
	}

	.app-body {
		height: calc(100% - 56px - env(safe-area-inset-bottom));
	}

	.app-footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 56px;
		background-color: var(--bg-color, #f5f0e8);
		border-top: 1px solid #d1d5db;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 9999;
	}

	.home-container {
		display: none;
		flex-direction: column;
		height: 100%;
	}

	.home-container.visible {
		display: flex;
	}

	.map-area {
		flex: 1;
		min-height: 0;
	}

	@media only screen and (max-width: 960px) {
		.inner-container {
			padding: 0;
			width: 100%;
			height: 100%;
			max-height: 100%;
			position: relative;
		}

		.app {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: 0;
			width: 100%;
			height: 100%;
			border-radius: 0;
			border: none;
		}
	}
</style>
