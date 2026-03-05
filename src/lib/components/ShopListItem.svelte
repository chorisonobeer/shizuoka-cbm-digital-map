<script lang="ts">
	import {
		ChevronRight,
		Beer,
		Wine,
		Wifi,
		CreditCard,
		Car,
		CigaretteOff,
		Globe2,
		MapPin,
		Clock,
		CalendarOff
	} from 'lucide-svelte';
	import { makeDistanceLabelText } from '$lib/distance-label';
	import type { ShopData } from '$lib/types';

	let {
		data,
		popupHandler,
		queryCategory
	}: { data: ShopData; popupHandler: (shop: ShopData) => void; queryCategory: string | null } =
		$props();

	const distanceTipText = $derived(makeDistanceLabelText(data.distance));
	const area = $derived(data.area);
	const image = $derived(data.logo_filename);
	const isCategoryPage = $derived(!!queryCategory);

	const categoryTags = $derived(
		data.categories
			? data.categories
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: []
	);

	type FeatureIcon = { label: string; icon: typeof Beer };
	const featureIcons = $derived(
		(
			[
				{ key: 'shizuoka_beer', label: '静岡ビール', icon: Beer },
				{ key: 'guest_beer', label: 'ゲスト', icon: Wine },
				{ key: 'free_wifi', label: 'Wi-Fi', icon: Wifi },
				{ key: 'credit_card', label: 'カード', icon: CreditCard },
				{ key: 'parking_lot', label: '駐車場', icon: Car },
				{ key: 'no_smoking', label: '禁煙', icon: CigaretteOff },
				{ key: 'available_in_english', label: '英語OK', icon: Globe2 }
			] as { key: string; label: string; icon: typeof Beer }[]
		).filter((f) => data[f.key] === '1')
	);

	function clickHandler() {
		popupHandler(data);
	}
</script>

<button class="card" onclick={clickHandler}>
	{#if image}
		<div class="card-thumb">
			<img src={image} alt={data.name} />
		</div>
	{/if}

	<div class="card-body">
		<!-- 店舗名: 最大のジャンプ率で視線を引く -->
		<h2 class="card-title">{data.name}</h2>

		<!-- タグ行: 地域・カテゴリを色分け -->
		<div class="card-tags">
			{#if !isCategoryPage && area}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<a href={`/list?category=${area}`} class="tag tag-area" onclick={(e) => e.stopPropagation()}>
					<MapPin size={10} />
					{area}
				</a>
			{/if}
			{#each categoryTags as cat}
				<span class="tag tag-cat">{cat}</span>
			{/each}
		</div>

		<!-- メタ情報: 営業時間・定休日 -->
		<div class="card-meta">
			{#if data.hours}
				<span class="meta-row">
					<Clock size={12} class="meta-icon" />
					<span class="meta-text">{data.hours}</span>
				</span>
			{/if}
			{#if data.closed_days}
				<span class="meta-row meta-closed">
					<CalendarOff size={12} class="meta-icon" />
					<span class="meta-text">定休: {data.closed_days}</span>
				</span>
			{/if}
		</div>

		<!-- 距離 -->
		{#if distanceTipText}
			<span class="card-distance">{distanceTipText}</span>
		{/if}

		<!-- 特徴バッジ -->
		{#if featureIcons.length > 0}
			<div class="card-features">
				{#each featureIcons as feat}
					<span class="badge" title={feat.label}>
						<feat.icon size={11} />
						{feat.label}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="card-arrow">
		<ChevronRight size={20} />
	</div>
</button>

<style>
	/* ===== Card Container ===== */
	.card {
		display: flex;
		align-items: stretch;
		gap: 14px;
		padding: 14px;
		background: #fff;
		border: none;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		cursor: pointer;
		text-align: left;
		width: 100%;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
		font-family: inherit;
	}
	.card:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}
	.card:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	/* ===== Thumbnail ===== */
	.card-thumb {
		flex-shrink: 0;
		width: 88px;
		height: 88px;
		border-radius: 10px;
		overflow: hidden;
		align-self: center;
		background: #f3f4f6;
	}
	.card-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* ===== Body ===== */
	.card-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* ===== Title — ジャンプ率の要: 16px/700 ===== */
	.card-title {
		font-size: 16px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
		word-break: break-all;
	}

	/* ===== Tags — 11px/600 大文字風コンパクトバッジ ===== */
	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		padding: 2px 7px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		line-height: 1.5;
		white-space: nowrap;
		text-decoration: none;
	}
	.tag-area {
		background: #fef3c7;
		color: #b45309;
	}
	.tag-area:hover {
		background: #fde68a;
	}
	.tag-cat {
		background: #ede9fe;
		color: #5b21b6;
	}

	/* ===== Meta — 12px/400 控えめなセカンダリ情報 ===== */
	.card-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.meta-row {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.meta-row :global(.meta-icon) {
		color: #9ca3af;
		flex-shrink: 0;
	}
	.meta-text {
		font-size: 12px;
		font-weight: 400;
		color: #6b7280;
		line-height: 1.5;
	}
	.meta-closed .meta-text {
		color: #dc2626;
		font-weight: 500;
	}

	/* ===== Distance — 12px/600 アクセントカラー ===== */
	.card-distance {
		font-size: 12px;
		font-weight: 600;
		color: #2563eb;
	}

	/* ===== Feature badges — 10px/500 最小の情報レイヤー ===== */
	.card-features {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 2px;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		padding: 2px 6px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		font-size: 10px;
		font-weight: 500;
		color: #6b7280;
		white-space: nowrap;
		line-height: 1.5;
	}

	/* ===== Arrow ===== */
	.card-arrow {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: #d1d5db;
	}
</style>
