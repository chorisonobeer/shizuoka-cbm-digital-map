const DAY_MAP: Record<string, number> = {
	Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6
};

const DAY_ORDER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function expandDays(dayPart: string): number[] {
	const days: number[] = [];
	const groups = dayPart.split(',');
	for (const group of groups) {
		const trimmed = group.trim();
		if (trimmed === 'PH') continue;
		if (trimmed.includes('-')) {
			const [start, end] = trimmed.split('-').map((d) => d.trim());
			const startIdx = DAY_ORDER.indexOf(start);
			const endIdx = DAY_ORDER.indexOf(end);
			if (startIdx === -1 || endIdx === -1) continue;
			if (startIdx <= endIdx) {
				for (let i = startIdx; i <= endIdx; i++) {
					days.push(DAY_MAP[DAY_ORDER[i]]);
				}
			} else {
				for (let i = startIdx; i < 7; i++) {
					days.push(DAY_MAP[DAY_ORDER[i]]);
				}
				for (let i = 0; i <= endIdx; i++) {
					days.push(DAY_MAP[DAY_ORDER[i]]);
				}
			}
		} else if (DAY_MAP[trimmed] !== undefined) {
			days.push(DAY_MAP[trimmed]);
		}
	}
	return days;
}

function timeToMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
}

/**
 * hours_structured をパースして現在営業中かどうかを判定する。
 * 空文字や不明なフォーマットの場合は null を返す（判定不能）。
 */
export function isOpen(hoursStructured: string, now?: Date): boolean | null {
	if (!hoursStructured || !hoursStructured.trim()) return null;

	const date = now || new Date();
	const currentDay = date.getDay(); // 0=Sun
	const currentMinutes = date.getHours() * 60 + date.getMinutes();

	// 前日の深夜営業チェック用
	const yesterdayDay = (currentDay + 6) % 7;

	const blocks = hoursStructured.split(';').map((b) => b.trim()).filter(Boolean);

	for (const block of blocks) {
		// "Mo-Fr 11:00-14:30,17:00-23:00" のような形式
		const firstSpace = block.indexOf(' ');
		if (firstSpace === -1) continue;

		const dayPart = block.substring(0, firstSpace);
		const timePart = block.substring(firstSpace + 1);
		const days = expandDays(dayPart);
		const timeRanges = timePart.split(',').map((t) => t.trim()).filter(Boolean);

		for (const range of timeRanges) {
			const match = range.match(/^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
			if (!match) continue;

			const openMin = timeToMinutes(match[1]);
			const closeMin = timeToMinutes(match[2]);

			if (closeMin > openMin) {
				// 通常パターン（例: 11:00-23:00）
				if (days.includes(currentDay) && currentMinutes >= openMin && currentMinutes < closeMin) {
					return true;
				}
			} else {
				// 深夜越えパターン（例: 18:00-01:00）
				// 当日の開始時間以降
				if (days.includes(currentDay) && currentMinutes >= openMin) {
					return true;
				}
				// 前日から続く深夜営業（翌日の0:00〜closeMin）
				if (days.includes(yesterdayDay) && currentMinutes < closeMin) {
					return true;
				}
			}
		}
	}

	return false;
}
