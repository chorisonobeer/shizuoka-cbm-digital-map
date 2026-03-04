import Papa from 'papaparse';
import config from '$lib/config';
import type { ShopData } from '$lib/types';

export const prerender = false;
export const ssr = false;

export async function load({ fetch }) {
	const response = await fetch(config.data_url);
	if (!response.ok) {
		return { shopList: [] as ShopData[], config };
	}

	const csvText = await response.text();
	const results = Papa.parse(csvText, { header: true });
	const features = results.data as Record<string, string>[];

	const shopList: ShopData[] = [];
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
		// logo_filename をパス付きに変換 (例: "logo_1.png" → "/images/logos/logo_1.png")
		if (feature.logo_filename && !feature.logo_filename.startsWith('/')) {
			feature.logo_filename = `/images/logos/${feature.logo_filename}`;
		}
		shopList.push({ index: i, ...feature });
	}

	// 店舗番号順にソート
	shopList.sort((a, b) => Number(a.number) - Number(b.number));

	return { shopList, config };
}
