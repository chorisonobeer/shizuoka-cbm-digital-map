<script lang="ts">
	import { Plus } from 'lucide-svelte';

	let { data: pageData } = $props();
	const config = $derived(pageData.config);

	function clickHandler() {
		if (config.form_url) {
			window.location.href = config.form_url;
		}
	}
</script>

<div class="about-us">
	<div class="container">
		<div class="branding">
			<div class="image"><img src="/icon-pwamap.svg" alt="" /></div>
			<div class="logo">Geolonia PWAマップ</div>
		</div>

		<p>
			Geolonia
			PWAマップは、Google
			スプレッドシートを更新するだけでオリジナルの地図アプリを作成することができます。
		</p>
		<p>プログラムはオープンソースで公開しているため、自由にカスタマイズしてご利用いただけます。</p>

		<h2>Geolonia PWAマップについて</h2>
		<p>
			<a
				href="https://blog.geolonia.com/2022/05/17/pwamap-beta.html"
				target="_blank"
				rel="noreferrer"
			>
				https://blog.geolonia.com/2022/05/17/pwamap-beta.html
			</a>
		</p>

		<p>
			また、独自ドメインでの利用やデザインのカスタマイズや利用に必要な緯度・経度情報の提供も有償で別途承ります。ご希望の方は下記までお問い合わせください。
		</p>

		<h2>お問い合わせフォーム</h2>
		<p>
			<a href="https://geolonia.com/contact/" target="_blank" rel="noreferrer">
				https://geolonia.com/contact/
			</a>
		</p>
		<p>
			※カスタマイズおよびアプリの作成・利用についてはサポート対象外となります。あらかじめご了承ください。
		</p>

		{#if config.form_url}
			<h2>データの更新について</h2>
			<p>
				このアプリのデータを更新するには下の「 + 」ボタンを押してフォームに必要な情報を入力してください。
			</p>
			<div class="goto-form">
				<button onclick={clickHandler}><Plus color="#FFFFFF" /></button>
			</div>
		{/if}
	</div>
</div>

<style>
	.about-us {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 24px;
		overflow: scroll;
		scrollbar-width: none;
	}

	.about-us::-webkit-scrollbar {
		display: none;
	}

	.container {
		margin: 0;
		padding: 0;
		padding-bottom: 50px;
	}

	.container :global(a) {
		word-break: break-all;
	}

	.branding {
		margin-bottom: 40px;
		text-align: center;
	}

	.branding .logo {
		font-size: 28px;
	}

	.branding .image {
		width: 70%;
		margin: auto;
		margin-bottom: 20px;
	}

	p {
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.4rem;
		margin-bottom: 1rem;
	}

	.goto-form button {
		position: absolute;
		bottom: calc(32px + env(safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		z-index: 99999;
		background-color: #007bff;
		border: none;
		padding: 8px;
		border-radius: 100%;
		display: block;
		box-sizing: border-box;
		cursor: pointer;
	}

	.goto-form button :global(svg) {
		display: block;
		width: 24px;
		height: 24px;
	}
</style>
