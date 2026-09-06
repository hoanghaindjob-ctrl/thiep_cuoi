import { toLunar } from "@/lib/lunar";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/**
 * The wedding month, with the day itself ringed. Weeks start on Monday, as a
 * Vietnamese calendar prints them, so Sunday lands in the last column.
 */
export function MiniCalendar({ date }: { date: string }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  const first = new Date(Date.UTC(year, month - 1, 1));
  // getUTCDay(): 0 = Sunday. Shift so Monday = 0.
  const lead = (first.getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const lunar = toLunar(date);

  return (
    <div className="lich-nho">
      <div className="lich-thang">
        Tháng {month} / {year}
      </div>
      <div className="lich-tuan" aria-hidden="true">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="lich-ngay" role="presentation">
        {cells.map((c, i) => (
          <span key={i} className={c === day ? "dam" : undefined}>
            {c ?? ""}
          </span>
        ))}
      </div>
      {lunar && (
        <p className="lich-am">
          Nhằm ngày {String(lunar.day).padStart(2, "0")} tháng{" "}
          {String(lunar.month).padStart(2, "0")} âm lịch
        </p>
      )}
    </div>
  );
}
