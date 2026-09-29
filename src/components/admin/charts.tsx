import type { ReactNode } from "react";

/**
 * Bağımlılıksız, sunucuda render edilen grafikler (dataviz kuralları):
 * ince çubuklar (≤24px), veri ucunda 4px yuvarlak, tek taban çizgisi, çubuklar arası
 * 2px yüzey boşluğu, hafif ızgara, her çubukta hover ipucu, metinler seri renginde değil.
 * Renkler (açık zemin, doğrulandı): seri-1 #2a78d6, seri-2 #e34948; tek seri: marka kırmızısı.
 */

const SERIES_1 = "#2a78d6";
const SERIES_2 = "#e34948";
const SINGLE = "#ef101b";

/** Hover ipucu (CSS ile; JS gerektirmez) */
function Tip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-[#111] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover/mark:block">
      {children}
    </span>
  );
}

/* ------------------------------ Yatay çubuk (tek seri) ------------------------------ */

export function HBarChart({
  rows,
  format,
  tooltip,
}: {
  rows: { key: string; label: ReactNode; value: number }[];
  format: (n: number) => string;
  tooltip?: (key: string) => ReactNode;
}) {
  const max = Math.max(...rows.map((r) => r.value), 0);
  if (rows.length === 0 || max === 0) return <EmptyChart />;

  return (
    <ul className="space-y-3" role="list">
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,12rem)_1fr]">
          <span className="truncate text-sm font-semibold text-[#111]">{r.label}</span>
          <div className="flex items-center gap-2">
            <div className="group/mark relative h-5 flex-1">
              <div
                className="h-full rounded-r-[4px]"
                style={{ width: `${Math.max((r.value / max) * 100, 0.5)}%`, background: SINGLE }}
                aria-label={`${format(r.value)}`}
              />
              {tooltip && <Tip>{tooltip(r.key)}</Tip>}
            </div>
            <span className="w-24 shrink-0 text-right text-sm font-bold tabular-nums text-[#111]">{format(r.value)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------- Gruplu sütun (2 seri, tek eksen) --------------------------- */

export function GroupedColumns({
  groups,
  series,
  format,
  axisFormat,
}: {
  groups: { key: string; label: string; values: [number, number] }[];
  series: [string, string];
  format: (n: number) => string;
  axisFormat: (n: number) => string;
}) {
  const rawMax = Math.max(...groups.flatMap((g) => g.values), 0);
  if (rawMax === 0) return <EmptyChart />;
  const ticks = niceTicks(rawMax);
  const max = ticks[ticks.length - 1];
  const colors = [SERIES_1, SERIES_2];

  return (
    <div>
      {/* Legend (≥2 seri → her zaman) */}
      <div className="mb-6 flex flex-wrap gap-4 text-xs font-semibold text-black/60">
        {series.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: colors[i] }} />
            {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-2">
        {/* Y ekseni */}
        <div className="relative h-56 w-14">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2 text-[11px] font-medium tabular-nums text-black/40" style={{ bottom: `${(t / max) * 100}%` }}>
              {axisFormat(t)}
            </span>
          ))}
        </div>

        <div>
          <div className="relative h-56">
            {/* Izgara */}
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-black/[0.07]" style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
            {/* Sütunlar */}
            <div className="absolute inset-0 flex items-end justify-around">
              {groups.map((g) => (
                <div key={g.key} className="flex h-full items-end gap-[2px]">
                  {g.values.map((v, i) => (
                    <div key={i} className="group/mark relative flex h-full w-[clamp(8px,2.2vw,22px)] items-end">
                      <div className="w-full rounded-t-[4px]" style={{ height: `${(v / max) * 100}%`, background: colors[i] }} />
                      <Tip>
                        {g.label} · {series[i]}: {format(v)}
                      </Tip>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* X ekseni */}
          <div className="mt-2 flex justify-around">
            {groups.map((g) => (
              <span key={g.key} className="text-[11px] font-semibold text-black/45">
                {g.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 0'dan başlayan 4-5 "temiz" eksen değeri */
function niceTicks(max: number) {
  const rough = max / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? rough;
  const count = Math.ceil(max / step);
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

function EmptyChart() {
  return (
    <div className="flex h-40 items-center justify-center rounded-[14px] border border-dashed border-black/10 text-sm font-medium text-black/40">
      Bu aralıkta veri yok.
    </div>
  );
}
