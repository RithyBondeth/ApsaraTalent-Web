import { chromium } from "playwright";
const OUT = process.argv[2];
const b = await chromium.launch();
for (const theme of ["dark", "light"]) {
  const ctx = await b.newContext({ viewport: { width: 900, height: 700 } });
  const page = await ctx.newPage();
  await page.addInitScript((m) => {
    try {
      localStorage.setItem("theme", m);
    } catch {}
  }, theme);
  await page
    .goto("http://localhost:4000/design-system", { waitUntil: "networkidle" })
    .catch(() => {});
  await page.evaluate(
    (m) => document.documentElement.classList.toggle("dark", m === "dark"),
    theme,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  const sec = page.locator("section").filter({ hasText: "Neak" }).first();
  if (await sec.count()) {
    await sec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await sec.screenshot({ path: `${OUT}/pet-${theme}.png` });
  }
  console.log(theme, await sec.count());
  await ctx.close();
}
await b.close();
