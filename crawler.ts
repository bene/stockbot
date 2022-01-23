import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import * as log from "https://deno.land/std@0.122.0/log/mod.ts";

import { RenderSide } from "./src/Store.ts";
import { NotificationService } from "./src/NotificationService.ts";

const ns = new NotificationService();
ns.sendRawMessage("StockBot is running.");

async function crawl(
  name: string,
  storeName: string,
  url: string,
  renderSide: RenderSide,
  matcher: (content: string) => boolean,
  waitForFunction?: string
) {
  try {
    const content = await getContent(url, renderSide, waitForFunction);
    const result = matcher(content);

    if (result) {
      console.log(`${name} in ${storeName}: ${result}`);
      ns.notify(name, storeName, url);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getContent(
  url: string,
  renderSide: RenderSide,
  waitForFunction?: string
) {
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4469.0 Safari/537.36";

  log.info(`${new Date().toLocaleTimeString()} - ${url}`);

  if (renderSide === RenderSide.Server) {
    const res = await fetch(url, {
      headers: {
        "user-agent": userAgent,
      },
    });
    if (!res.ok) {
      throw { url, status: res.status };
    }
    const content = await res.text();
    return content;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(userAgent);
  await page.goto(url, { waitUntil: "networkidle2" });

  try {
    if (waitForFunction) {
      await page.waitForFunction(waitForFunction!, { timeout: 5000 });
    }
    const content = await page.content();
    return content;
  } catch (err) {
    await page.screenshot({ path: `logs/${Date.now()}.png` });
    throw err;
  } finally {
    await browser.close();
  }
}

export { crawl };
