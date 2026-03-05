import Papa from 'papaparse';
import config from '$lib/config';
import type { EventData, EventStatus } from '$lib/types';

let eventList = $state<EventData[]>([]);
let loaded = $state(false);
let initializing = false;

/**
 * 開催期間文字列から開始日・終了日を抽出する
 * 例: "2025年9月20(土)-21(日)" → { start: Date(2025-09-20), end: Date(2025-09-21) }
 * 例: "2025年6月21日(土)-22日(日)" → { start: Date(2025-06-21), end: Date(2025-06-22) }
 */
function parseDateRange(period: string): { start: Date | null; end: Date | null } {
	if (!period) return { start: null, end: null };

	// "YYYY年M月D日" パターンで年月を取得
	const yearMatch = period.match(/(\d{4})年(\d{1,2})月/);
	if (!yearMatch) return { start: null, end: null };

	const year = parseInt(yearMatch[1]);
	const month = parseInt(yearMatch[2]);

	// 開始日: 最初の "月D日" or "月D(" パターン
	const startDayMatch = period.match(/月(\d{1,2})/);
	if (!startDayMatch) return { start: null, end: null };
	const startDay = parseInt(startDayMatch[1]);
	const start = new Date(year, month - 1, startDay);

	// 終了日: "-" の後の日付
	const endPart = period.split('-').pop() || period.split('〜').pop() || '';
	const endDayMatch = endPart.match(/(\d{1,2})/);
	let end: Date;
	if (endDayMatch) {
		// 終了部分に月がある場合
		const endMonthMatch = endPart.match(/(\d{1,2})月/);
		const endMonth = endMonthMatch ? parseInt(endMonthMatch[1]) : month;
		const endDay = parseInt(endDayMatch[1]);
		// 月がある場合はその月の日、なければ開始月の日
		if (endMonthMatch) {
			end = new Date(year, endMonth - 1, endDay);
		} else {
			end = new Date(year, month - 1, endDay);
		}
	} else {
		end = start;
	}

	return { start, end };
}

function determineStatus(startDate: Date | null, endDate: Date | null): EventStatus {
	if (!startDate || !endDate) return 'upcoming';

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const endOfDay = new Date(endDate);
	endOfDay.setHours(23, 59, 59, 999);

	if (today > endOfDay) return 'ended';
	if (today >= startDate && today <= endOfDay) return 'ongoing';
	return 'upcoming';
}

export const eventStore = {
	get eventList(): EventData[] {
		return eventList;
	},
	get isLoaded(): boolean {
		return loaded;
	},
	async initialize(fetchFn: typeof fetch) {
		if (loaded || initializing) return;
		initializing = true;

		try {
			const url = config.data_url_event;
			if (!url) {
				loaded = true;
				initializing = false;
				return;
			}

			const response = await fetchFn(url);
			if (!response.ok) {
				loaded = true;
				initializing = false;
				return;
			}

			const csvText = await response.text();
			const results = Papa.parse(csvText, { header: true });
			const rows = results.data as Record<string, string>[];

			const list: EventData[] = [];
			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				if (!row['イベント名']) continue;
				if (row['非公開']) continue;

				const { start, end } = parseDateRange(row['開催期間'] || '');
				const status = determineStatus(start, end);

				list.push({
					index: i,
					表示優先度: row['表示優先度'] || '0',
					イベント名: row['イベント名'] || '',
					開催期間: row['開催期間'] || '',
					'開始/終了時間': row['開始/終了時間'] || '',
					場所: row['場所'] || '',
					緯度: row['緯度'] || '',
					経度: row['経度'] || '',
					説明文: row['説明文'] || '',
					画像URL1: row['画像URL1'] || '',
					画像URL2: row['画像URL2'] || '',
					画像URL3: row['画像URL3'] || '',
					画像URL4: row['画像URL4'] || '',
					画像URL5: row['画像URL5'] || '',
					画像URL6: row['画像URL6'] || '',
					公式サイト: row['公式サイト'] || '',
					Instagram: row['Instagram'] || '',
					Facebook: row['Facebook'] || '',
					X: row['X'] || '',
					主催者名: row['主催者名'] || '',
					タグ: row['タグ'] || '',
					非公開: row['非公開'] || '',
					参加ブルワリー: row['参加ブルワリー'] || '',
					status,
					startDate: start,
					endDate: end
				});
			}

			// 表示優先度の降順 → 同優先度は開始日の昇順
			list.sort((a, b) => {
				const prioA = parseInt(a['表示優先度']) || 0;
				const prioB = parseInt(b['表示優先度']) || 0;
				if (prioB !== prioA) return prioB - prioA;
				const dateA = a.startDate?.getTime() ?? Infinity;
				const dateB = b.startDate?.getTime() ?? Infinity;
				return dateA - dateB;
			});

			eventList = list;
		} finally {
			loaded = true;
			initializing = false;
		}
	}
};
