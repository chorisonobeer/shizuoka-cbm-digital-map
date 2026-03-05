export type ShopData = {
	index: number;
	distance?: number;
	number: string;
	name: string;
	address: string;
	phone: string;
	hours: string;
	hours_structured: string;
	closed_days: string;
	seats: string;
	taps: string;
	description_ja: string;
	description_en: string;
	area: string;
	latitude: string;
	longitude: string;
	web_url: string;
	logo_filename: string;
	instagram: string;
	twitter: string;
	facebook: string;
	categories: string;
	brewery_name: string;
	[key: string]: string | number | undefined;
};

export type LngLat = [number, number];
