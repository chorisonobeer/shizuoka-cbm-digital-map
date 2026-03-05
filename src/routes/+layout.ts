import config from '$lib/config';

export const prerender = false;
export const ssr = false;

export async function load() {
	return { config };
}
