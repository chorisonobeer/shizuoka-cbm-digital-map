import Papa from 'papaparse';
import config from '$lib/config';
import type { ShopData } from '$lib/types';

let shopList = $state<ShopData[]>([]);
let loaded = $state(false);
let initializing = false;

export const shopStore = {
	get shopList(): ShopData[] {
		return shopList;
	},
	get isLoaded(): boolean {
		return loaded;
	},
	async initialize(fetchFn: typeof fetch) {
		if (loaded || initializing) return;
		initializing = true;

		try {
			const response = await fetchFn(config.data_url);
			if (!response.ok) {
				initializing = false;
				loaded = true;
				return;
			}

			const csvText = await response.text();
			const results = Papa.parse(csvText, { header: true });
			const features = results.data as Record<string, string>[];

			const list: ShopData[] = [];
			for (let i = 0; i < features.length; i++) {
				const feature = features[i] as unknown as ShopData;
				if (!feature.latitude || !feature.longitude || !feature.name) {
					continue;
				}
				if (!feature.latitude.match(/^[0-9]+(\.[0-9]+)?$/)) {
					continue;
				}
				if (!feature.longitude.match(/^[0-9]+(\.[0-9]+)?$/)) {
					continue;
				}
				if (feature.logo_filename && !feature.logo_filename.startsWith('/')) {
					feature.logo_filename = `/images/logos/${feature.logo_filename}`;
				}
				list.push({ index: i, ...feature });
			}

			list.sort((a, b) => Number(a.number) - Number(b.number));
			shopList = list;
		} finally {
			loaded = true;
			initializing = false;
		}
	}
};
