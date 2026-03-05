const setCluster = (map: any) => {
	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'shops',
		filter: ['has', 'point_count'],
		paint: {
			'circle-radius': [
				'step',
				['get', 'point_count'],
				18,   // < 5件
				5, 22, // 5-9件
				10, 26 // 10件以上
			],
			'circle-color': '#1a2e44',
			'circle-opacity': 0.85,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#ffffff'
		}
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'shops',
		filter: ['has', 'point_count'],
		paint: {
			'text-color': '#FFFFFF'
		},
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-size': 13,
			'text-font': ['Noto Sans Regular']
		}
	});

	map.on('click', 'clusters', (e: any) => {
		const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
		const clusterId = features[0].properties.cluster_id;
		map.getSource('shops').getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
			if (err) return;
			map.easeTo({
				center: features[0].geometry.coordinates,
				zoom: zoom
			});
		});
	});

	map.on('mouseenter', 'clusters', () => {
		map.getCanvas().style.cursor = 'pointer';
	});

	map.on('mouseleave', 'clusters', () => {
		map.getCanvas().style.cursor = '';
	});
};

export default setCluster;
