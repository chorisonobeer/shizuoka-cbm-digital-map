type Feature = {
	type: string;
	geometry: {
		type: string;
		coordinates: number[];
	};
	properties: Record<string, string>;
};

type GeoJSON = {
	type: string;
	features: Feature[];
};

const toGeoJson = (data: Record<string, any>[]): GeoJSON => {
	const geojson: GeoJSON = {
		type: 'FeatureCollection',
		features: []
	};

	for (const id in data) {
		const item = data[id];

		if (!item.longitude || !item.latitude || !item.name) {
			continue;
		}

		const feature: Feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [Number(item.longitude), Number(item.latitude)]
			},
			properties: { _id: id }
		};

		for (const key of Object.keys(item)) {
			feature.properties[key] = item[key];
		}

		// カテゴリ優先度: 醸造所 > 飲める > 買える
		const cats = (item.categories || '').split(',').map((c: string) => c.trim());
		if (cats.includes('醸造所')) {
			feature.properties.primaryCategory = '醸造所';
		} else if (cats.includes('飲める')) {
			feature.properties.primaryCategory = '飲める';
		} else if (cats.includes('買える')) {
			feature.properties.primaryCategory = '買える';
		} else {
			feature.properties.primaryCategory = '飲める';
		}

		geojson.features.push(feature);
	}

	return geojson;
};

export default toGeoJson;
