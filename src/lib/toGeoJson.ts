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

		geojson.features.push(feature);
	}

	return geojson;
};

export default toGeoJson;
