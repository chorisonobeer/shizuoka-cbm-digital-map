import type { LngLat } from './types';

export const askGeolocationPermission = (): Promise<LngLat | null> => {
	return new Promise((resolve) => {
		if (!window.navigator.geolocation || !window.navigator.geolocation.getCurrentPosition) {
			resolve(null);
			return;
		}

		window.navigator.geolocation.getCurrentPosition(
			(pos) => {
				const lat = pos.coords.latitude;
				const lng = pos.coords.longitude;
				resolve([lng, lat]);
			},
			() => {
				resolve(null);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			}
		);
	});
};
