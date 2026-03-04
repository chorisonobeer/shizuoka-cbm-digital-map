<script lang="ts">
	import Map from '$lib/components/Map.svelte';

	let { data } = $props();
</script>

<Map data={data.shopList} />
