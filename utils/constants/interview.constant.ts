/* ----------------------------- Duration Options --------------------------- */
export const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1 hr 30 min" },
  { value: 120, label: "2 hr" },
] as const;

/* -------------------------------- Time Slots ------------------------------ */
export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const hh = String(h).padStart(2, "0");
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { value: `${hh}:${m}`, label: `${h12}:${m} ${suffix}` };
});
