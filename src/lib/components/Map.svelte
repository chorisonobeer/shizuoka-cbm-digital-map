<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import geojsonExtent from '@mapbox/geojson-extent';
	import toGeoJson from '$lib/toGeoJson';
	import setCluster from '$lib/setCluster';
	import Shop from './Shop.svelte';
	import type { ShopData } from '$lib/types';

	let { data, visible = true }: { data: ShopData[]; visible?: boolean } = $props();

	let mapNode: HTMLDivElement;
	let mapObject: any = $state(null);
	let markersInitialized = $state(false);
	let selectedShop: ShopData | undefined = $state(undefined);
	let isWarmStyle = $state(true);
	let toggleBtn: HTMLButtonElement;
	let markers: any[] = [];

	const WARM_STYLE = '/map-style.json';
	const BASIC_STYLE = 'geolonia/basic';

	function getCSSVar(name: string, fallback: string): string {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
	}

	const CATEGORY_COLORS: Record<string, string> = {
		'醸造所': getCSSVar('--primary-color', '#253980'),
		'飲める': getCSSVar('--sub-color', '#c8a96e'),
		'買える': getCSSVar('--accent-color', '#3a6b8c')
	};

	const hideLayers = [
		'poi', 'poi-primary', 'poi-r0-r9', 'poi-r10-r24', 'poi-r25',
		'poi-bus', 'poi-entrance',
		'poi-z16', 'poi-z16-primary', 'poi-z15', 'poi-z14', 'poi-z11',
		'poi-worship', 'poi-worship-primary', 'poi-park', 'poi-park-primary',
		'poi-railway', 'poi-airport-primary', 'poi-mountain'
	];

	function hidePoiLayers(map: any) {
		for (const layerId of hideLayers) {
			try { map.setLayoutProperty(layerId, 'visibility', 'none'); } catch (_) {}
		}
	}

	function clearMarkers() {
		for (const m of markers) {
			m.remove();
		}
		markers = [];
	}

	function addMarkers(map: any, shopData: ShopData[]) {
		clearMarkers();
		const { geolonia } = window as any;
		const geojson = toGeoJson(shopData);

		// South-to-north sort for proper overlap
		const sorted = [...geojson.features].sort((a, b) => {
			return b.geometry.coordinates[1] - a.geometry.coordinates[1];
		});

		for (const feature of sorted) {
			const cat = feature.properties.primaryCategory || '飲める';
			const color = CATEGORY_COLORS[cat] || getCSSVar('--sub-color', '#c8a96e');

			const marker = new geolonia.Marker({ color })
				.setLngLat(feature.geometry.coordinates)
				.addTo(map);

			marker.getElement().style.cursor = 'pointer';
			marker.getElement().addEventListener('click', () => {
				selectedShop = feature.properties as unknown as ShopData;
			});

			markers.push(marker);
		}
	}

	function initClusterAndMarkers(map: any, shopData: ShopData[]) {
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

			setCluster(map);
			addMarkers(map, shopData);
			markersInitialized = true;

			// Hide/show markers based on cluster zoom
			map.on('zoom', () => {
				updateMarkerVisibility(map);
			});
			map.on('moveend', () => {
				updateMarkerVisibility(map);
			});
		});
	}

	function updateMarkerVisibility(map: any) {
		const zoom = map.getZoom();
		const bounds = map.getBounds();

		for (const m of markers) {
			const lngLat = m.getLngLat();
			const inBounds = bounds.contains(lngLat);
			// At cluster zoom levels, query if point is clustered
			if (zoom <= 14 && inBounds) {
				const point = map.project(lngLat);
				const features = map.queryRenderedFeatures(point, { layers: ['clusters'] });
				const el = m.getElement();
				if (features.length > 0) {
					el.style.display = 'none';
				} else {
					el.style.display = '';
				}
			} else {
				m.getElement().style.display = inBounds ? '' : 'none';
			}
		}
	}

	function updateMapData(map: any, shopData: ShopData[]) {
		const geojson = toGeoJson(shopData);
		const source = map.getSource('shops');
		if (source) {
			source.setData(geojson);
		}
		addMarkers(map, shopData);
	}

	function toggleStyle() {
		if (!mapObject) return;
		isWarmStyle = !isWarmStyle;
		const newStyle = isWarmStyle ? WARM_STYLE : BASIC_STYLE;

		// Save current data before style change
		const currentData = data;
		markersInitialized = false;
		clearMarkers();

		mapObject.setStyle(newStyle);

		// After style loads, re-add sources/layers/markers
		mapObject.once('style.load', () => {
			if (!isWarmStyle) {
				hidePoiLayers(mapObject);
			}
			if (currentData.length > 0) {
				const geojson = toGeoJson(currentData);
				mapObject.addSource('shops', {
					type: 'geojson',
					data: geojson,
					cluster: true,
					clusterMaxZoom: 14,
					clusterRadius: 25
				});
				setCluster(mapObject);
				addMarkers(mapObject, currentData);
				markersInitialized = true;
			}
		});
	}

	// display:none -> visible recovery
	$effect(() => {
		if (visible && mapObject) {
			mapObject.resize();
		}
	});

	$effect(() => {
		if (mapObject && data.length > 0) {
			if (!markersInitialized) {
				initClusterAndMarkers(mapObject, data);
			} else {
				updateMapData(mapObject, data);
			}
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
			style: WARM_STYLE,
			localIdeographFontFamily: 'sans-serif'
		});

		const onMapLoad = () => {
			mapObject = map;
			// トグルをコントロール群の直下に配置
			const ctrlContainer = mapNode.querySelector('.maplibregl-ctrl-top-right');
			if (ctrlContainer && toggleBtn) {
				const rect = ctrlContainer.getBoundingClientRect();
				const mapRect = mapNode.getBoundingClientRect();
				toggleBtn.style.top = `${rect.bottom - mapRect.top + 6}px`;
			}
		};

		const orientationHandler = () => map.resize();

		map.on('load', onMapLoad);
		window.addEventListener('orientationchange', orientationHandler);

		return () => {
			window.removeEventListener('orientationchange', orientationHandler);
			map.off('load', onMapLoad);
			clearMarkers();
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
	<button
		bind:this={toggleBtn}
		class="style-toggle"
		class:active={isWarmStyle}
		onclick={toggleStyle}
		aria-label={isWarmStyle ? 'BASICスタイルに切替' : 'CBMスタイルに切替'}
	>
		<span class="toggle-track">
			<span class="toggle-thumb"></span>
		</span>
	</button>
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

	.style-toggle {
		position: absolute;
		top: 0;
		right: 10px;
		z-index: 10;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.toggle-track {
		display: block;
		width: 36px;
		height: 20px;
		border-radius: 10px;
		background: var(--muted-color);
		position: relative;
		transition: background 0.2s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	}

	.style-toggle.active .toggle-track {
		background: var(--primary-color);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.style-toggle.active .toggle-thumb {
		transform: translateX(16px);
	}
</style>
