function createTeardropIcon(color: string, size = 36): Promise<HTMLImageElement> {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	const cx = size / 2;
	const r = size * 0.32;
	const tipY = size - 2;

	ctx.beginPath();
	ctx.arc(cx, r + 2, r, Math.PI * 0.85, Math.PI * 0.15, false);
	ctx.lineTo(cx, tipY);
	ctx.closePath();

	ctx.fillStyle = color;
	ctx.fill();
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;
	ctx.stroke();

	// Inner highlight
	ctx.beginPath();
	ctx.arc(cx, r + 2, r * 0.45, 0, Math.PI * 2);
	ctx.fillStyle = 'rgba(255,255,255,0.35)';
	ctx.fill();

	return new Promise((resolve) => {
		const img = new Image(size, size);
		img.onload = () => resolve(img);
		img.src = canvas.toDataURL();
	});
}

const setCluster = async (map: any) => {
	const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#253980';
	const subColor = getComputedStyle(document.documentElement).getPropertyValue('--sub-color').trim() || '#c8a96e';
	const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#3a6b8c';
	const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#333333';

	const pinSize = 48;
	const categories: [string, string][] = [
		['醸造所', primaryColor],
		['飲める', subColor],
		['買える', accentColor]
	];

	for (const [cat, color] of categories) {
		const img = await createTeardropIcon(color, pinSize);
		map.addImage(`pin-${cat}`, img);
	}

	// Cluster circles
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
			'circle-color': primaryColor,
			'circle-opacity': 0.85,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#ffffff'
		}
	});

	// Cluster count labels
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
			'text-size': 11,
			'text-font': ['Noto Sans Regular']
		}
	});

	// Unclustered points (teardrop pins)
	map.addLayer({
		id: 'unclustered-point',
		type: 'symbol',
		source: 'shops',
		filter: ['!', ['has', 'point_count']],
		layout: {
			'icon-image': [
				'match',
				['get', 'primaryCategory'],
				'醸造所', 'pin-醸造所',
				'飲める', 'pin-飲める',
				'買える', 'pin-買える',
				'pin-飲める'
			],
			'icon-size': 1,
			'icon-anchor': 'bottom',
			'icon-allow-overlap': true
		}
	});

	// Shop name labels (above points in layer order)
	map.addLayer({
		id: 'shop-labels',
		type: 'symbol',
		source: 'shops',
		filter: ['!', ['has', 'point_count']],
		minzoom: 0,
		layout: {
			'text-field': ['get', 'name'],
			'text-font': ['Noto Sans CJK JP Bold'],
			'text-size': 12,
			'text-offset': [0, 0.9],
			'text-anchor': 'top',
			'text-allow-overlap': false
		},
		paint: {
			'text-color': textColor,
			'text-halo-color': '#ffffff',
			'text-halo-width': 1.5
		}
	});

	// Cluster click → zoom in
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

	// Cursor changes
	for (const layerId of ['clusters', 'unclustered-point']) {
		map.on('mouseenter', layerId, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', layerId, () => {
			map.getCanvas().style.cursor = '';
		});
	}
};

export default setCluster;
