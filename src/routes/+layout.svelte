<script lang="ts">
	import '../app.css';
	import Tabbar from '$lib/components/Tabbar.svelte';
	import About from '$lib/components/About.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{data.config?.title || 'Geolonia PWAマップ'}</title>
	<meta name="description" content={data.config?.description || ''} />
</svelte:head>

<div class="outer-container">
	<div class="inner-container">
		<About config={data.config} />
		<div class="app">
			<div class="app-body">
				{@render children()}
			</div>
			<div class="app-footer">
				<Tabbar />
			</div>
		</div>
	</div>
</div>

<style>
	:global(*) {
		padding: 0;
		margin: 0;
		font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', 'メイリオ', Meiryo,
			'ＭＳ Ｐゴシック', sans-serif;
		font-size: 16px;
	}

	:global(a) {
		color: #007bff;
		text-decoration: none;
	}

	:global(.small) {
		font-size: 0.8rem;
	}

	:global(.nowrap) {
		white-space: nowrap;
		margin-right: 8px;
		margin-bottom: 5px;
	}

	:global(img) {
		max-width: 100%;
		height: auto;
	}

	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		position: fixed;
		overflow: hidden;
	}

	.outer-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--background-image);
		background-size: cover;
	}

	.inner-container {
		padding: 0;
		width: 720px;
		height: 673px;
		max-height: 90%;
		position: relative;
	}

	.app {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 381px;
		height: 100%;
		border-radius: 20px;
		overflow: hidden;
		background-color: #ffffff;
		border: 3px solid #555555;
	}

	.app-body {
		height: calc(100% - 56px - env(safe-area-inset-bottom));
	}

	.app-footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 56px;
		background-color: #E7E7E5;
		border-top: 1px solid #d1d5db;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 9999;
	}

	@media only screen and (max-width: 960px) {
		.inner-container {
			padding: 0;
			width: 100%;
			height: 100%;
			max-height: 100%;
			position: relative;
		}

		.app {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: 0;
			width: 100%;
			height: 100%;
			border-radius: 0;
			border: none;
		}
	}
</style>
