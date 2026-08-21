import type { CollectionEntry } from 'astro:content';

export type Webinar = CollectionEntry<'webinars'>;

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * 'YYYY-MM-DD' を数値で分解してローカル日付にする。
 * new Date('2026-09-29') はUTC解釈になり、タイムゾーンによって曜日が1日ずれるため使わない。
 */
function parse(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d, jsDate: new Date(y, m - 1, d) };
}

export function formatDate(date: string) {
  const { y, m, d, jsDate } = parse(date);
  return {
    year: y,
    month: m,
    day: d,
    /** '2026 SEP' */
    monthLabel: `${y} ${MONTHS_EN[m - 1]}`,
    /** '火' */
    weekday: WEEKDAYS[jsDate.getDay()],
    /** '2026年9月29日(火)' */
    full: `${y}年${m}月${d}日(${WEEKDAYS[jsDate.getDay()]})`,
    /** '2026/09/29' */
    slash: `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`,
    /** '9/29 (火)' */
    short: `${m}/${d} (${WEEKDAYS[jsDate.getDay()]})`,
  };
}

/** 開催日が過ぎているか。静的生成のため「ビルド実行時点」で判定される */
export function isPast(date: string, now = new Date()) {
  const { jsDate } = parse(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return jsDate.getTime() < today.getTime();
}

/**
 * 一覧の振り分け方針(重要)
 *
 * - 開催予定タブ : status='upcoming' かつ 開催日がビルド時点で未来/当日。開催日の昇順。
 * - アーカイブタブ: status='archive'。開催日の降順。
 * - status='upcoming' のまま開催日が過ぎたもの("stray")は、開催予定から自動的に外す。
 *   ただし archiveVideoUrl が無いためアーカイブにも出さない = どちらにも表示されない。
 *   CLAUDE.md の運用どおり、開催後は MDX の status を 'archive' に変更し
 *   archiveVideoUrl を設定すること。気付けるようビルド時に警告を出す。
 *
 * 判定は静的ビルド時に確定するため、開催日を過ぎても再ビルドするまで表示は変わらない。
 * (Vercelは push で再ビルドされる。日付だけで落としたい場合は定期再デプロイが必要)
 */
export function splitWebinars(all: Webinar[], now = new Date()) {
  const upcoming = all
    .filter((w) => w.data.status === 'upcoming' && !isPast(w.data.date, now))
    .sort((a, b) => a.data.date.localeCompare(b.data.date));

  const archive = all
    .filter((w) => w.data.status === 'archive')
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  const stray = all.filter((w) => w.data.status === 'upcoming' && isPast(w.data.date, now));

  if (stray.length) {
    console.warn(
      `[webinars] 開催日を過ぎた status:'upcoming' が ${stray.length} 件あります。` +
        ` status を 'archive' に変更し archiveVideoUrl を設定してください: ` +
        stray.map((w) => w.id).join(', ')
    );
  }

  return { upcoming, archive, stray };
}

/** 'HH:MM–HH:MM' を分解。en dash / ハイフン / 波ダッシュに対応 */
export function parseTimeRange(timeLabel: string) {
  const m = timeLabel.match(/(\d{1,2}):(\d{2})\s*[–—~〜-]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return { startH: +m[1], startM: +m[2], endH: +m[3], endM: +m[4] };
}

/**
 * Googleカレンダー追加URL。時刻はJST(+09:00)固定でUTCに変換して埋め込む。
 * timeLabel が解析できない場合は null を返し、リンク自体を出さない。
 */
export function googleCalendarUrl(w: Webinar, siteUrl?: URL | string) {
  const t = parseTimeRange(w.data.timeLabel);
  if (!t) return null;
  const { y, m, d } = parse(w.data.date);

  const toUtcStamp = (h: number, min: number) => {
    // JST(UTC+9)の壁時計時刻としてUTCに直す
    const ms = Date.UTC(y, m - 1, d, h - 9, min);
    return new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: w.data.title,
    dates: `${toUtcStamp(t.startH, t.startM)}/${toUtcStamp(t.endH, t.endM)}`,
    details: w.data.description,
    location: w.data.format,
  });
  if (siteUrl) params.set('details', `${w.data.description}\n${siteUrl}`);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
