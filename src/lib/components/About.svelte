<script lang="ts">
	let { config }: { config: Record<string, string> } = $props();
	const logoUrl = $derived(config.logo_image_url || '/logo.svg');
</script>

<div class="about-banner">
	<div class="branding">
		<img class="image" src={logoUrl} alt="" />
	</div>
	<div class="description">{config.description || ''}</div>
</div>

<style>
	.about-banner {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-left: 415px;
		box-sizing: border-box;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #ffffff;
	}

	.branding {
		text-align: center;
	}

	.branding .image {
		width: 70%;
		height: auto;
		display: block;
		margin: auto;
		margin-bottom: 20px;
	}

	.description {
		max-width: 250px;
		text-shadow: 1px 2px 3px #303030;
		word-break: break-all;
	}

	@media only screen and (max-width: 960px) {
		.about-banner {
			display: none;
		}
	}
</style>
