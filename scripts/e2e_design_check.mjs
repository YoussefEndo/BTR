// ============================================================
// Design verification for the redesigned homepage + category page.
// Checks: hero, category images actually load, sections present,
// no console errors / failed requests. Takes screenshots.
// Usage: node scripts/e2e_design_check.mjs
// ============================================================
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3001";

const consoleErrors = [];
const failedRequests = [];

function out(json) {
  console.log(JSON.stringify(json, null, 2));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
  });

  // --- Homepage ---
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200)); // let images decode

  const home = await page.evaluate(() => {
    const text = document.body.innerText;
    const imgs = [...document.querySelectorAll("img")];
    return {
      hero: text.includes("vos dimensions."),
      badge: text.includes("Mobilier sur mesure"),
      valueProps: ["100% sur mesure", "Devis gratuit", "Suivi direct"].every(
        (t) => text.includes(t)
      ),
      categoriesSection: text.includes("Explorez nos catégories"),
      stepsSection: text.includes("Comment ça marche ?"),
      whySection: text.includes("Pourquoi nous choisir ?"),
      ctaSection: text.includes("Vous avez un projet ?"),
      unsplashImgs: imgs.filter((i) => i.src.includes("unsplash")).length,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      imgCount: imgs.length,
    };
  });

  // Category cards: all should render images (DB was seeded)
  const categoryCardCount = await page.$$eval(
    'a[href^="/categories/"]',
    (els) => els.length
  );

  await page.screenshot({ path: "/tmp/btr_home.png", fullPage: true });

  // --- Category page (first category link) ---
  const catHref = await page.$eval('a[href^="/categories/"]', (a) =>
    a.getAttribute("href")
  );
  await page.goto(BASE + catHref, {
    waitUntil: "networkidle2",
    timeout: 45000,
  });
  await new Promise((r) => setTimeout(r, 1200));

  const cat = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")];
    return {
      h1: document.querySelector("h1")?.textContent.trim() ?? null,
      heroBadge: document.body.innerText.includes("Catégorie"),
      unsplashImgs: imgs.filter((i) => i.src.includes("unsplash")).length,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
    };
  });

  await page.screenshot({ path: "/tmp/btr_category.png", fullPage: true });

  // --- Mobile viewport sanity ---
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 45000 });
  const mobile = await page.evaluate(() => ({
    horizontalOverflow:
      document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  await page.screenshot({ path: "/tmp/btr_mobile.png" });

  out({
    home: { ...home, categoryCardCount },
    categoryPage: { ...cat, href: catHref },
    mobile,
    consoleErrors,
    failedRequests,
  });
} finally {
  await browser.close();
}
