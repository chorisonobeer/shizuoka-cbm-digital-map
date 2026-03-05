<script lang="ts">
	import { onMount } from 'svelte';
	import {
		X,
		MapPin,
		Clock,
		CalendarOff,
		Armchair,
		Beer,
		Wine,
		Wifi,
		CreditCard,
		Car,
		CigaretteOff,
		Globe2,
		Tv,
		Wallet,
		Receipt,
		Cigarette,
		Columns2,
		Factory,
		CalendarCheck,
		Mail,
		Users,
		Instagram,
		Twitter,
		Facebook,
		Globe,
		Phone,
		Cylinder,
		Package,
		Cog
	} from 'lucide-svelte';
	import { makeDistanceLabelText } from '$lib/distance-label';
	import type { ShopData } from '$lib/types';

	let { shop, onclose }: { shop: ShopData; onclose: () => void } = $props();

	let mapNode: HTMLDivElement;
	let mapInstance: any = null;

	const distanceTipText = $derived(makeDistanceLabelText(shop.distance));

	const categoryTags = $derived(
		shop.categories
			? shop.categories
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: []
	);

	const allFeatures = $derived(
		(
			[
				{ key: 'shizuoka_beer', label: '静岡ビール', icon: Beer },
				{ key: 'guest_beer', label: 'ゲストビール', icon: Wine },
				{ key: 'tasting', label: 'テイスティング', icon: Beer },
				{ key: 'free_wifi', label: 'Wi-Fi', icon: Wifi },
				{ key: 'available_in_english', label: '英語対応', icon: Globe2 },
				{ key: 'watching_sports', label: 'スポーツ観戦', icon: Tv },
				{ key: 'e_money', label: '電子マネー', icon: Wallet },
				{ key: 'credit_card', label: 'クレジットカード', icon: CreditCard },
				{ key: 'cover_charge', label: 'チャージあり', icon: Receipt },
				{ key: 'parking_lot', label: '駐車場', icon: Car },
				{ key: 'no_smoking', label: '禁煙', icon: CigaretteOff },
				{ key: 'smoking', label: '喫煙可', icon: Cigarette },
				{ key: 'separation', label: '分煙', icon: Columns2 },
				{ key: 'brewery_tour', label: '醸造所見学', icon: Factory },
				{ key: 'reservation_required', label: '要予約', icon: CalendarCheck },
				{ key: 'mail_required', label: 'メール要', icon: Mail },
				{ key: 'group_ok', label: '団体OK', icon: Users }
			] as { key: string; label: string; icon: typeof Beer }[]
		).filter((f) => shop[f.key] === '1')
	);

	const servingStyles = $derived(
		(
			[
				{ key: 'kegs', label: '樽生', icon: Cylinder },
				{ key: 'bottles', label: 'ボトル', icon: Package },
				{ key: 'cans', label: '缶', icon: Cog }
			] as { key: string; label: string; icon: typeof Beer }[]
		).filter((f) => shop[f.key] === '1')
	);

	const socialLinks = $derived(
		[
			shop.instagram && shop.instagram !== '0'
				? {
						url: `https://instagram.com/${shop.instagram}`,
						label: 'Instagram',
						icon: Instagram
					}
				: null,
			shop.twitter && shop.twitter !== '0'
				? { url: `https://twitter.com/${shop.twitter}`, label: 'Twitter', icon: Twitter }
				: null,
			shop.facebook && shop.facebook !== '0'
				? {
						url: `https://www.facebook.com/${shop.facebook}`,
						label: 'Facebook',
						icon: Facebook
					}
				: null,
			shop.web_url
				? { url: shop.web_url, label: 'ウェブサイト', icon: Globe }
				: null
		].filter(Boolean) as { url: string; label: string; icon: typeof Globe }[]
	);

	function toBreakLine(text: string): string[] {
		return text.split(/\r\n|\n|\r/);
	}

	function clickHandler() {
		onclose();
		if (mapNode && mapInstance) {
			mapNode.remove();
			mapInstance.remove();
		}
	}

	onMount(() => {
		if (!mapNode) return;
		const { geolonia } = window as any;
		mapInstance = new geolonia.Map({
			container: mapNode,
			interactive: false,
			zoom: 14,
			style: 'geolonia/gsi'
		});
	});
</script>

<div class="overlay">
	<!-- ヘッダー -->
	<header class="header">
		<button class="close-btn" onclick={clickHandler}>
			<X size={18} /> <span>閉じる</span>
		</button>
	</header>

	<div class="scroll-area">
		<!-- ヒーロー画像 -->
		{#if shop.logo_filename}
			<div class="hero">
				<img src={shop.logo_filename} alt={shop.name} />
			</div>
		{/if}

		<div class="content">
			<!-- 店舗名: 22px/800 — ページ最大の視覚的アンカー -->
			<h2 class="shop-name">{shop.name}</h2>

			<!-- 醸造所名: 14px/400 サブタイトル -->
			{#if shop.brewery_name}
				<p class="brewery-name">{shop.brewery_name}</p>
			{/if}

			<!-- タグ行 -->
			<div class="tag-row">
				{#if shop.area}
					<span class="tag tag-area"><MapPin size={10} />{shop.area}</span>
				{/if}
				{#each categoryTags as cat}
					<span class="tag tag-cat">{cat}</span>
				{/each}
				{#if distanceTipText}
					<span class="tag tag-dist">{distanceTipText}</span>
				{/if}
			</div>

			<!-- 基本情報カード -->
			<div class="info-card">
				{#if shop.address}
					<div class="info-row">
						<MapPin size={16} class="info-icon" />
						<span class="info-value">{shop.address}</span>
					</div>
				{/if}
				{#if shop.phone}
					<div class="info-row">
						<Phone size={16} class="info-icon" />
						<a href={`tel:${shop.phone}`} class="info-link">{shop.phone}</a>
					</div>
				{/if}
				{#if shop.hours}
					<div class="info-row">
						<Clock size={16} class="info-icon" />
						<span class="info-value">{shop.hours}</span>
					</div>
				{/if}
				{#if shop.closed_days}
					<div class="info-row closed">
						<CalendarOff size={16} class="info-icon" />
						<span class="info-value">定休日: {shop.closed_days}</span>
					</div>
				{/if}
				{#if shop.seats}
					<div class="info-row">
						<Armchair size={16} class="info-icon" />
						<span class="info-value">席数: {shop.seats}</span>
					</div>
				{/if}
				{#if shop.taps}
					<div class="info-row">
						<Beer size={16} class="info-icon" />
						<span class="info-value">タップ: {shop.taps}</span>
					</div>
				{/if}
			</div>

			<!-- 特徴チップ -->
			{#if allFeatures.length > 0}
				<section class="section">
					<h3 class="section-title">特徴</h3>
					<div class="chip-grid">
						{#each allFeatures as feat}
							<span class="chip">
								<feat.icon size={14} />
								<span>{feat.label}</span>
							</span>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 提供形態 -->
			{#if servingStyles.length > 0}
				<section class="section">
					<h3 class="section-title">提供形態</h3>
					<div class="chip-grid">
						{#each servingStyles as s}
							<span class="chip">
								<s.icon size={14} />
								<span>{s.label}</span>
							</span>
						{/each}
					</div>
				</section>
			{/if}

			<!-- SNS -->
			{#if socialLinks.length > 0}
				<section class="section">
					<h3 class="section-title">リンク</h3>
					<div class="link-row">
						{#each socialLinks as link}
							<a href={link.url} target="_blank" rel="noopener" class="social-link">
								<link.icon size={20} />
								<span>{link.label}</span>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 紹介文 -->
			{#if shop.description_ja}
				<section class="section">
					<h3 class="section-title">紹介</h3>
					<p class="body-text">
						{#each toBreakLine(shop.description_ja) as line, i}
							{#if i > 0}<br />{/if}{line}
						{/each}
					</p>
				</section>
			{/if}

			{#if shop.description_en}
				<section class="section">
					<h3 class="section-title">About</h3>
					<p class="body-text body-en">
						{#each toBreakLine(shop.description_en) as line, i}
							{#if i > 0}<br />{/if}{line}
						{/each}
					</p>
				</section>
			{/if}

			<!-- 地図 -->
			<section class="section">
				<div
					bind:this={mapNode}
					class="map-embed"
					data-lat={shop.latitude}
					data-lng={shop.longitude}
					data-navigation-control="off"
				></div>
				<a
					class="directions-btn"
					href={`http://maps.apple.com/?q=${shop.latitude},${shop.longitude}`}
				>
					<MapPin size={16} />
					道順を表示
				</a>
			</section>
		</div>
	</div>
</div>

<style>
	/* =================================================================
	   Typography Scale (px-based for precision):
	     Display  : 22px / 800  — shop name (jump ratio ~1.8x vs body)
	     Subtitle : 14px / 400  — brewery name
	     Section  : 13px / 700  — section headings (uppercase feel)
	     Body     : 15px / 400  — description text
	     Info     : 14px / 400  — address, hours, etc.
	     Tag      : 11px / 600  — compact badges
	     Caption  : 10px / 500  — smallest info layer
	   Line Heights:
	     Headings : 1.2
	     Body     : 1.7
	     UI       : 1.5
	   ================================================================= */

	/* ===== Overlay ===== */
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		background: #f5f5f4;
		display: flex;
		flex-direction: column;
	}

	/* ===== Header ===== */
	.header {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 16px;
		height: 48px;
		background: var(--primary-color);
		flex-shrink: 0;
	}
	.close-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: none;
		border: none;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		padding: 6px 10px;
		border-radius: 8px;
		transition: background 0.15s;
	}
	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	/* ===== Scroll ===== */
	.scroll-area {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}
	.scroll-area::-webkit-scrollbar {
		display: none;
	}

	/* ===== Hero ===== */
	.hero {
		width: 100%;
		max-height: 220px;
		overflow: hidden;
		background: #e5e5e5;
	}
	.hero img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		display: block;
	}

	/* ===== Content ===== */
	.content {
		padding: 24px 20px 120px;
	}

	/* ===== Shop Name — Display 22px/800 ===== */
	.shop-name {
		font-size: 22px;
		font-weight: 800;
		color: #171717;
		margin: 0 0 2px;
		line-height: 1.2;
		letter-spacing: -0.02em;
		word-break: break-all;
	}

	/* ===== Brewery — Subtitle 14px/400 ===== */
	.brewery-name {
		font-size: 14px;
		font-weight: 400;
		color: #737373;
		margin: 0 0 12px;
		line-height: 1.5;
	}

	/* ===== Tags ===== */
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 20px;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		padding: 3px 8px;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 600;
		line-height: 1.5;
	}
	.tag-area {
		background: #fef3c7;
		color: #b45309;
	}
	.tag-cat {
		background: #ede9fe;
		color: #5b21b6;
	}
	.tag-dist {
		background: #dbeafe;
		color: #1d4ed8;
	}

	/* ===== Info Card ===== */
	.info-card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		margin-bottom: 24px;
	}
	.info-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}
	.info-row :global(.info-icon) {
		flex-shrink: 0;
		color: #a3a3a3;
		margin-top: 1px;
	}
	.info-value {
		font-size: 14px;
		font-weight: 400;
		color: #404040;
		line-height: 1.5;
	}
	.closed .info-value {
		color: #dc2626;
		font-weight: 600;
	}
	.info-link {
		font-size: 14px;
		font-weight: 500;
		color: var(--primary-color);
		text-decoration: none;
		line-height: 1.5;
	}
	.info-link:hover {
		text-decoration: underline;
	}

	/* ===== Sections ===== */
	.section {
		margin-bottom: 24px;
	}
	.section-title {
		font-size: 13px;
		font-weight: 700;
		color: #a3a3a3;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0 0 10px;
		line-height: 1.2;
	}

	/* ===== Chips ===== */
	.chip-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #404040;
		line-height: 1.5;
	}

	/* ===== Social Links ===== */
	.link-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 500;
		color: #404040;
		text-decoration: none;
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.social-link:hover {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 1px var(--primary-color);
		color: var(--primary-color);
	}

	/* ===== Body Text — 15px/400/1.7 ===== */
	.body-text {
		font-size: 15px;
		font-weight: 400;
		color: #404040;
		line-height: 1.7;
		word-break: break-all;
		margin: 0;
	}
	.body-en {
		color: #737373;
		font-size: 14px;
	}

	/* ===== Map ===== */
	.map-embed {
		width: 100%;
		height: 200px;
		border-radius: 12px;
		overflow: hidden;
	}
	.directions-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		padding: 12px 20px;
		background: var(--primary-color);
		color: #fff;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
	}
	.directions-btn:hover {
		opacity: 0.9;
	}
</style>
