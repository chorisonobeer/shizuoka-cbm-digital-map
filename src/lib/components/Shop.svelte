<script lang="ts">
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';
	import Links from './Links.svelte';
	import { makeDistanceLabelText } from '$lib/distance-label';
	import type { ShopData } from '$lib/types';

	let { shop, onclose }: { shop: ShopData; onclose: () => void } = $props();

	let mapNode: HTMLDivElement;
	let mapInstance: any = null;

	const distanceTipText = $derived(makeDistanceLabelText(shop.distance));
	const area = $derived(shop.area);

	function toBreakLine(text: string): string[] {
		return text.split(/\r\n|\n|\r/);
	}

	function clickHandler() {
		onclose();
		if (mapNode && mapInstance) {
			mapNode.remove();
			mapInstance.remove();
		}
	}

	onMount(() => {
		if (!mapNode) return;
		const { geolonia } = window as any;
		mapInstance = new geolonia.Map({
			container: mapNode,
			interactive: false,
			zoom: 14,
			style: 'geolonia/gsi'
		});
	});
</script>

<div class="shop-single">
	<div class="head">
		<button onclick={clickHandler}><X size={16} color="#FFFFFF" /> 閉じる</button>
	</div>
	<div class="container">
		<h2>{shop.name}</h2>
		<div>
			<span class="nowrap">
				<a href={`/list?category=${area}`}>
					<span class="category">{area}</span>
				</a>
			</span>
			{#if distanceTipText}
				<span class="nowrap"><span class="distance">現在位置から {distanceTipText}</span></span>
			{/if}
		</div>

		<div style="margin: 24px 0"><Links data={shop} /></div>

		{#if shop.logo_filename}
			<img src={shop.logo_filename} alt={shop.name} style="width: 100%" />
		{/if}

		<p style="margin: 24px 0; word-break: break-all">
			{#each toBreakLine(shop.description_ja || '') as line, i}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>

		{#if shop.address}
			<p style="font-size: 0.9rem; color: #666">{shop.address}</p>
		{/if}
		{#if shop.phone}
			<p style="font-size: 0.9rem"><a href={`tel:${shop.phone}`}>{shop.phone}</a></p>
		{/if}
		{#if shop.hours}
			<p style="font-size: 0.9rem; color: #666">{shop.hours}</p>
		{/if}

		<div
			bind:this={mapNode}
			style="width: 100%; height: 200px; margin-top: 24px"
			data-lat={shop.latitude}
			data-lng={shop.longitude}
			data-navigation-control="off"
		></div>

		<p>
			<a class="small" href={`http://maps.apple.com/?q=${shop.latitude},${shop.longitude}`}>
				スポットまでの道順
			</a>
		</p>
	</div>
</div>

<style>
	.shop-single {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 10;
		background-color: #ffffff;
		height: 100%;
	}

	.container {
		height: 100%;
		box-sizing: border-box;
		padding: 16px 16px 120px;
		overflow: scroll;
		scrollbar-width: none;
	}

	.container::-webkit-scrollbar {
		display: none;
	}

	h2 {
		font-size: 1.4rem;
		word-break: break-all;
	}

	.head {
		padding: 0 16px;
		background-color: var(--primary-color);
		box-sizing: border-box;
		height: 44px;
		text-align: right;
	}

	.head button {
		position: relative;
		background-color: transparent;
		margin: 0;
		padding: 0;
		border: none;
		color: #ffffff;
		height: 44px;
		padding-left: 18px;
		font-size: 1rem;
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
	}

	.distance:hover {
		opacity: 0.8;
	}
</style>
