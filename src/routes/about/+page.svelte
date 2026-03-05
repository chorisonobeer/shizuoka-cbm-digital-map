<script lang="ts">
	let { data: pageData } = $props();
	const config = $derived(pageData.config);
</script>

<div class="about-us">
	<div class="container">
		<div class="branding">
			<div class="image"><img src={config.logo_image_url || '/logo.svg'} alt="静岡クラフトビールマップ" /></div>
			<div class="logo">静岡クラフトビールマップ</div>
			<div class="subtitle">SHIZUOKA CRAFT BEER MAP</div>
		</div>

		<section class="welcome">
			<h2>ようこそ！ビール王国静岡へ！</h2>
			<p class="welcome-en">Welcome to the Beer Kingdom of Shizuoka!</p>
			<p>
				地ビール醸造解禁後、伊豆の観光地を中心に90年代から多くの醸造所（ブルワリー）があった静岡県。そこへ2000年沼津に「ベアードビール」、2014年静岡市の市街地に「AOI BREWING」ができたのを機に、県内各地にマイクロブルワリーやビアバーが誕生し、今や静岡は19もの醸造所がある日本屈指のビール県となりました。
			</p>
			<p>
				四季を彩る旬の食材と、のどかな景色、歴史ある町並みと共に楽しめる個性豊かなしずおかのビールたち。さあ、この宝の地図を手に、静岡ビール巡りの旅へ！ NO BEER, NO LIFE!
			</p>
		</section>

		<section class="how-to">
			<h2>マップの使い方</h2>
			<div class="point">
				<span class="point-number">1</span>
				<div>
					<strong>目的地を決めてパブクロール！</strong>
					<p>通過県にされがちの静岡県、まずは目的地を決めて巡ろう！観光ついでに寄れる店や見学可能な醸造所も！</p>
				</div>
			</div>
			<div class="point">
				<span class="point-number">2</span>
				<div>
					<strong>各地のイベントを探そう！</strong>
					<p>全国でもレアなウィスキーとビールのイベントや、お店・料理とコラボ企画も。SNS等でCheck!</p>
				</div>
			</div>
			<div class="point">
				<span class="point-number">3</span>
				<div>
					<strong>ビールの輪を広げよう！ハッシュタグでSNSに投稿！</strong>
					<p>マップを持っているだけでコミュニケーションツールになります！SNSで投稿すればビア友が増えるかも!?</p>
				</div>
			</div>
		</section>

		<section class="hashtags">
			<h2>公式ハッシュタグ</h2>
			<div class="tag-list">
				<span class="tag">#静岡cbm</span>
				<span class="tag">#shizuokacbm</span>
				<span class="tag">#帰りたくない</span>
				<span class="tag">#静岡ビール子</span>
			</div>
		</section>

		<section class="supporter">
			<h2>サポーター募集中！</h2>
			<p>
				静岡クラフトビアマップチームでは、ビールを仕事やライフワークにしたい仲間を常時募集しています！ブルワリーやビアバーへの就職やアルバイトについてもサポートいたします。ビールイベントやセミナー、ワークショップの開催、コラボビールの醸造やホップ栽培など、ビールに関するご要望やお問い合わせはお気軽にご相談ください。
			</p>
			<p class="contact">
				<a href="mailto:shizuokacraftbeermap@gmail.com">shizuokacraftbeermap@gmail.com</a>
			</p>
		</section>

		<footer class="credit">
			<p>静岡市 商業活性化グループ事業補助金採択事業</p>
			<p class="copyright">&copy; Shizuoka Craft Beer Map</p>
		</footer>
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
		margin: 0 auto;
		padding: 0;
		padding-bottom: 80px;
		max-width: 640px;
	}

	.container :global(a) {
		word-break: break-all;
	}

	.branding {
		margin-bottom: 32px;
		text-align: center;
	}

	.branding .logo {
		font-size: 24px;
		font-weight: bold;
		color: var(--primary-color);
	}

	.branding .subtitle {
		font-size: 14px;
		color: var(--muted-color);
		margin-top: 4px;
	}

	.branding .image {
		width: 50%;
		max-width: 200px;
		margin: auto;
		margin-bottom: 16px;
	}

	.branding .image img {
		width: 100%;
		height: auto;
	}

	section {
		margin-bottom: 32px;
	}

	h2 {
		font-size: 1.3rem;
		font-weight: bold;
		margin-bottom: 12px;
		color: var(--primary-color);
		border-bottom: 2px solid var(--sub-color);
		padding-bottom: 6px;
	}

	p {
		font-size: 0.95rem;
		line-height: 1.7;
		margin-bottom: 0.8rem;
	}

	.welcome-en {
		font-size: 0.9rem;
		color: var(--muted-color);
		font-style: italic;
		margin-bottom: 1rem;
	}

	.how-to .point {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
		align-items: flex-start;
	}

	.point-number {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--primary-color);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 0.9rem;
		margin-top: 2px;
	}

	.point strong {
		display: block;
		margin-bottom: 4px;
		font-size: 0.95rem;
	}

	.point p {
		margin-bottom: 0;
		font-size: 0.9rem;
		color: var(--muted-color);
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		background: var(--primary-color);
		color: #fff;
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 0.9rem;
	}

	.supporter p.contact {
		text-align: center;
		margin-top: 12px;
	}

	.supporter p.contact a {
		color: var(--primary-color);
		font-weight: bold;
	}

	.credit {
		text-align: center;
		color: var(--muted-color);
		font-size: 0.85rem;
		border-top: 1px solid var(--muted-color);
		padding-top: 16px;
	}

	.credit .copyright {
		margin-top: 4px;
		font-size: 0.8rem;
	}
</style>
