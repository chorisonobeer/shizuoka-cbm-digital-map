<script lang="ts">
	import { CalendarDays, MapPin, Search, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { eventStore } from '$lib/eventStore.svelte';
	import type { EventData, EventStatus } from '$lib/types';

	let searchQuery = $state('');
	let activeFilter = $state<'all' | EventStatus>('all');
	let selectedEvent: EventData | undefined = $state(undefined);
	let carouselIndex = $state(0);

	const filters: { id: 'all' | EventStatus; label: string }[] = [
		{ id: 'all', label: 'すべて' },
		{ id: 'ongoing', label: '開催中' },
		{ id: 'upcoming', label: '開催予定' },
		{ id: 'ended', label: '終了' }
	];

	const filteredEvents = $derived(() => {
		let events = eventStore.eventList;

		if (activeFilter !== 'all') {
			events = events.filter((e) => e.status === activeFilter);
		}

		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			events = events.filter((e) =>
				e['イベント名'].toLowerCase().includes(q) ||
				e['場所'].toLowerCase().includes(q) ||
				e['タグ'].toLowerCase().includes(q) ||
				e['主催者名'].toLowerCase().includes(q)
			);
		}

		return events;
	});

	function getStatusLabel(status: EventStatus): string {
		switch (status) {
			case 'ongoing': return '開催中';
			case 'upcoming': return '開催予定';
			case 'ended': return '終了';
		}
	}

	function getImages(event: EventData): string[] {
		return [event['画像URL1'], event['画像URL2'], event['画像URL3'], event['画像URL4'], event['画像URL5'], event['画像URL6']].filter(Boolean);
	}

	function getTags(event: EventData): string[] {
		if (!event['タグ']) return [];
		return event['タグ'].split(',').map((t) => t.trim()).filter(Boolean);
	}

	function getBreweries(event: EventData): string[] {
		if (!event['参加ブルワリー']) return [];
		return event['参加ブルワリー'].split(',').map((t) => t.trim()).filter(Boolean);
	}

	function openDetail(event: EventData) {
		selectedEvent = event;
		carouselIndex = 0;
	}

	function closeDetail() {
		selectedEvent = undefined;
	}

	function clearSearch() {
		searchQuery = '';
	}
</script>

<div class="events-page">
	<!-- ヘッダー -->
	<div class="header">
		<div class="search-bar">
			<Search size={16} />
			<input
				type="text"
				placeholder="イベントを検索..."
				bind:value={searchQuery}
			/>
			{#if searchQuery}
				<button class="clear-btn" onclick={clearSearch}>
					<X size={14} />
				</button>
			{/if}
		</div>
		<div class="filter-tabs">
			{#each filters as filter}
				<button
					class="filter-tab"
					class:active={activeFilter === filter.id}
					onclick={() => activeFilter = filter.id}
				>
					{filter.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- イベント一覧 -->
	<div class="event-list">
		{#if filteredEvents().length === 0}
			<div class="empty">
				<CalendarDays size={40} strokeWidth={1.2} />
				<p>イベントが見つかりません</p>
			</div>
		{:else}
			<div class="card-list">
				{#each filteredEvents() as event (event.index)}
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<button class="event-card" onclick={() => openDetail(event)}>
						{#if event['画像URL1']}
							<div class="card-image">
								<img src={event['画像URL1']} alt={event['イベント名']} loading="lazy" />
								<span class="status-badge status-{event.status}">{getStatusLabel(event.status)}</span>
							</div>
						{:else}
							<div class="card-image card-image-empty">
								<CalendarDays size={32} strokeWidth={1.2} />
								<span class="status-badge status-{event.status}">{getStatusLabel(event.status)}</span>
							</div>
						{/if}
						<div class="card-body">
							<h3 class="card-title">{event['イベント名']}</h3>
							<span class="card-date">
								<CalendarDays size={12} />
								{event['開催期間']}
							</span>
							{#if event['場所']}
								<span class="card-place">
									<MapPin size={12} />
									{event['場所']}
								</span>
							{/if}
							{#if getTags(event).length > 0}
								<div class="card-tags">
									{#each getTags(event) as tag}
										<span class="tag">{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- 詳細モーダル -->
{#if selectedEvent}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal-overlay" role="dialog" aria-modal="true" onclick={closeDetail}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal" role="document" onclick={(e) => e.stopPropagation()}>
			<button class="modal-close" onclick={closeDetail}>
				<X size={20} />
			</button>

			<!-- 画像カルーセル -->
			{#if getImages(selectedEvent).length > 0}
				<div class="carousel">
					<img src={getImages(selectedEvent)[carouselIndex]} alt="" />
					{#if getImages(selectedEvent).length > 1}
						<button class="carousel-btn carousel-prev" onclick={() => carouselIndex = (carouselIndex - 1 + getImages(selectedEvent).length) % getImages(selectedEvent).length}>
							<ChevronLeft size={20} />
						</button>
						<button class="carousel-btn carousel-next" onclick={() => carouselIndex = (carouselIndex + 1) % getImages(selectedEvent).length}>
							<ChevronRight size={20} />
						</button>
						<div class="carousel-dots">
							{#each getImages(selectedEvent) as _, i}
								<span class="dot" class:active={i === carouselIndex}></span>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<div class="modal-body">
				<span class="status-badge status-{selectedEvent.status}">{getStatusLabel(selectedEvent.status)}</span>
				<h2 class="modal-title">{selectedEvent['イベント名']}</h2>

				<div class="modal-meta">
					<div class="meta-row">
						<CalendarDays size={14} />
						<span>{selectedEvent['開催期間']}</span>
					</div>
					{#if selectedEvent['開始/終了時間']}
						<div class="meta-row">
							<span class="meta-label">時間:</span>
							<span>{selectedEvent['開始/終了時間']}</span>
						</div>
					{/if}
					{#if selectedEvent['場所']}
						<div class="meta-row">
							<MapPin size={14} />
							<span>{selectedEvent['場所']}</span>
						</div>
					{/if}
					{#if selectedEvent['主催者名']}
						<div class="meta-row">
							<span class="meta-label">主催:</span>
							<span>{selectedEvent['主催者名']}</span>
						</div>
					{/if}
				</div>

				{#if selectedEvent['説明文']}
					<p class="modal-desc">{selectedEvent['説明文']}</p>
				{/if}

				{#if getBreweries(selectedEvent).length > 0}
					<div class="breweries">
						<h4>参加ブルワリー</h4>
						<div class="brewery-tags">
							{#each getBreweries(selectedEvent) as brewery}
								<span class="brewery-tag">{brewery}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if getTags(selectedEvent).length > 0}
					<div class="modal-tags">
						{#each getTags(selectedEvent) as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}

				<!-- リンク -->
				{#if selectedEvent['公式サイト'] || selectedEvent['Instagram'] || selectedEvent['Facebook'] || selectedEvent['X']}
					<div class="modal-links">
						{#if selectedEvent['公式サイト']}
							<a href={selectedEvent['公式サイト']} target="_blank" rel="noopener noreferrer" class="link-btn">
								<ExternalLink size={14} />
								公式サイト
							</a>
						{/if}
						{#if selectedEvent['Instagram']}
							<a href={selectedEvent['Instagram']} target="_blank" rel="noopener noreferrer" class="link-btn link-instagram">
								Instagram
							</a>
						{/if}
						{#if selectedEvent['Facebook']}
							<a href={selectedEvent['Facebook']} target="_blank" rel="noopener noreferrer" class="link-btn link-facebook">
								Facebook
							</a>
						{/if}
						{#if selectedEvent['X']}
							<a href={selectedEvent['X']} target="_blank" rel="noopener noreferrer" class="link-btn link-x">
								X
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.events-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--bg-color, #f5f0e8);
	}

	/* ===== Header ===== */
	.header {
		background: var(--primary-color, #1a2e44);
		padding: 10px 12px 0;
		flex-shrink: 0;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(255,255,255,0.15);
		border-radius: 8px;
		padding: 8px 12px;
		color: #fff;
	}

	.search-bar input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		color: #fff;
		font-size: 14px;
		font-family: inherit;
	}

	.search-bar input::placeholder {
		color: rgba(255,255,255,0.6);
	}

	.clear-btn {
		background: none;
		border: none;
		color: rgba(255,255,255,0.7);
		cursor: pointer;
		padding: 2px;
		display: flex;
	}

	.filter-tabs {
		display: flex;
		gap: 0;
		margin-top: 8px;
	}

	.filter-tab {
		flex: 1;
		padding: 8px 0;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: rgba(255,255,255,0.6);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s;
	}

	.filter-tab.active {
		color: #fff;
		border-bottom-color: var(--sub-color, #c8a96e);
	}

	/* ===== Event List ===== */
	.event-list {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px 12px;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 60px 0;
		color: #9ca3af;
	}

	/* ===== Event Card ===== */
	.event-card {
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0,0,0,0.08);
		cursor: pointer;
		text-align: left;
		border: none;
		width: 100%;
		font-family: inherit;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.event-card:hover {
		box-shadow: 0 6px 20px rgba(0,0,0,0.1);
		transform: translateY(-1px);
	}

	.event-card:active {
		transform: translateY(0);
	}

	.card-image {
		position: relative;
		width: 100%;
		height: 160px;
		overflow: hidden;
		background: #f3f4f6;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-image-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #d1d5db;
	}

	.status-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		line-height: 1.5;
	}

	.card-image .status-badge {
		position: absolute;
		top: 8px;
		left: 8px;
	}

	.status-ongoing {
		background: #dcfce7;
		color: #16a34a;
	}

	.status-upcoming {
		background: #dbeafe;
		color: #2563eb;
	}

	.status-ended {
		background: #f3f4f6;
		color: #9ca3af;
	}

	.card-body {
		padding: 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.card-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.3;
	}

	.card-date, .card-place {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #6b7280;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 2px;
	}

	.tag {
		display: inline-block;
		padding: 2px 8px;
		background: #ede9fe;
		color: #5b21b6;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
	}

	/* ===== Modal ===== */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 10000;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.modal {
		background: #fff;
		border-radius: 16px 16px 0 0;
		width: 100%;
		max-width: 500px;
		max-height: 85vh;
		overflow-y: auto;
		position: relative;
	}

	.modal-close {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 10;
		background: rgba(0,0,0,0.4);
		border: none;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		cursor: pointer;
	}

	/* ===== Carousel ===== */
	.carousel {
		position: relative;
		width: 100%;
		height: 220px;
		overflow: hidden;
		background: #f3f4f6;
	}

	.carousel img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0,0,0,0.3);
		border: none;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		cursor: pointer;
	}

	.carousel-prev { left: 8px; }
	.carousel-next { right: 8px; }

	.carousel-dots {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(255,255,255,0.5);
	}

	.dot.active {
		background: #fff;
	}

	/* ===== Modal Body ===== */
	.modal-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.modal-title {
		font-size: 18px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.3;
	}

	.modal-meta {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.meta-row {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		font-size: 13px;
		color: #4b5563;
	}

	.meta-label {
		font-weight: 600;
		white-space: nowrap;
	}

	.modal-desc {
		font-size: 14px;
		color: #374151;
		line-height: 1.7;
		margin: 0;
		white-space: pre-wrap;
	}

	.breweries h4 {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
		margin: 0 0 6px;
	}

	.brewery-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.brewery-tag {
		padding: 3px 10px;
		background: #fef3c7;
		color: #b45309;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;
	}

	.modal-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.modal-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 4px;
	}

	.link-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 8px 14px;
		background: var(--primary-color, #1a2e44);
		color: #fff;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.link-btn:hover {
		opacity: 0.85;
	}

	.link-instagram {
		background: #e1306c;
	}

	.link-facebook {
		background: #1877f2;
	}

	.link-x {
		background: #000;
	}
</style>
