<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import geojsonExtent from '@mapbox/geojson-extent';
	import toGeoJson from '$lib/toGeoJson';
	import setCluster from '$lib/setCluster';
	import Shop from './Shop.svelte';
	import type { ShopData } from '$lib/types';

	let { data }: { data: ShopData[] } = $props();

	let mapNode: HTMLDivElement;
	let mapObject: any = $state(null);
	let selectedShop: ShopData | undefined = $state(undefined);

	const hideLayers = [
		'poi',
		'poi-primary',
		'poi-r0-r9',
		'poi-r10-r24',
		'poi-r25',
		'poi-bus',
		'poi-entrance'
	];

	function hidePoiLayers(map: any) {
		for (const layerId of hideLayers) {
			map.setLayoutProperty(layerId, 'visibility', 'none');
		}
	}

	function addMarkers(map: any, shopData: ShopData[]) {
		if (!map || shopData.length === 0) return;

		map.on('render', () => {
			if (map.getSource('shops')) return;

			hidePoiLayers(map);

			const geojson = toGeoJson(shopData);

			map.addSource('shops', {
				type: 'geojson',
				data: geojson,
				cluster: true,
				clusterMaxZoom: 14,
				clusterRadius: 25
			});

			map.addLayer({
				id: 'shop-points',
				type: 'circle',
				source: 'shops',
				filter: ['all', ['==', '$type', 'Point']],
				paint: {
					'circle-radius': 13,
					'circle-color': '#FF0000',
					'circle-opacity': 0.4,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#FFFFFF',
					'circle-stroke-opacity': 1
				}
			});

			map.addLayer({
				id: 'shop-symbol',
				type: 'symbol',
				source: 'shops',
				filter: ['all', ['==', '$type', 'Point']],
				paint: {
					'text-color': '#000000',
					'text-halo-color': '#FFFFFF',
					'text-halo-width': 2
				},
				layout: {
					'text-field': '{name}',
					'text-font': ['Noto Sans Regular'],
					'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
					'text-radial-offset': 0.5,
					'text-justify': 'auto',
					'text-size': 12,
					'text-anchor': 'top',
					'text-max-width': 12,
					'text-allow-overlap': false
				}
			});

			map.on('mouseenter', 'shop-points', () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', 'shop-points', () => {
				map.getCanvas().style.cursor = '';
			});
			map.on('mouseenter', 'shop-symbol', () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', 'shop-symbol', () => {
				map.getCanvas().style.cursor = '';
			});

			map.on('click', 'shop-points', (event: any) => {
				if (!event.features[0].properties.cluster) {
					selectedShop = event.features[0].properties;
				}
			});

			map.on('click', 'shop-symbol', (event: any) => {
				if (!event.features[0].properties.cluster) {
					selectedShop = event.features[0].properties;
				}
			});

			setCluster(map);
		});
	}

	$effect(() => {
		if (mapObject && data.length > 0) {
			addMarkers(mapObject, data);
			const geojson = toGeoJson(data);
			const bounds = geojsonExtent(geojson);
			if (bounds) {
				mapObject.fitBounds(bounds, { padding: 50 });
			}
		}
	});

	onMount(() => {
		if (!mapNode) return;

		const { geolonia } = window as any;
		const map = new geolonia.Map({
			container: mapNode,
			style: 'geolonia/gsi'
		});

		const onMapLoad = () => {
			hidePoiLayers(map);
			mapObject = map;
		};

		const orientationHandler = () => map.resize();

		map.on('load', onMapLoad);
		window.addEventListener('orientationchange', orientationHandler);

		return () => {
			window.removeEventListener('orientationchange', orientationHandler);
			map.off('load', onMapLoad);
		};
	});

	function closeShop() {
		selectedShop = undefined;
	}
</script>

<div class="map-wrapper">
	<div
		bind:this={mapNode}
		class="map-container"
		data-geolocate-control="on"
		data-marker="off"
		data-gesture-handling="off"
	></div>
	{#if selectedShop}
		<Shop shop={selectedShop} onclose={closeShop} />
	{/if}
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.map-container {
		width: 100%;
		height: 100%;
	}
</style>
