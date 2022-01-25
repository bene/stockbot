import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";

import { RenderSide } from "./src/Store.ts";
import { NotificationService } from "./src/NotificationService.ts";

const ns = new NotificationService();
ns.sendRawMessage(`StockBot is running on .`);

export interface Response {
  content?: string;
  status: number;
}

async function crawl(
  name: string,
  storeName: string,
  url: string,
  renderSide: RenderSide,
  matcher: (content: string) => boolean,
  waitForFunction?: string
) {
  try {
    const response = await getContent(url, renderSide, waitForFunction);
    if (!response.content) {
      return response;
    }
    const result = matcher(response.content);

    if (result) {
      ns.notify(name, storeName, url);
      console.log(`${name} in ${storeName}: ${result}`);
    }

    return response;
  } catch (err) {
    console.log(err);
  }
}

async function getContent(
  url: string,
  renderSide: RenderSide,
  waitForFunction?: string
): Promise<Response> {
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4469.0 Safari/537.36";

  console.info(`${new Date().toLocaleTimeString()} - ${url}`);

  if (renderSide === RenderSide.Server) {
    const res = await fetch(url, {
      headers: {
        "user-agent": userAgent,
      },
    });
    if (!res.ok) {
      console.log({ status: res.status, url });
      return { status: res.status };
    }
    const content = await res.text();
    return { content, status: res.status };
  }

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(userAgent);
  const res = await page.goto(url, { waitUntil: "networkidle2" });
  const status = res.status();

  if (!res.ok()) {
    console.log({ url, status });
    return { status };
  }

  try {
    if (waitForFunction) {
      await page.waitForFunction(waitForFunction!, { timeout: 5000 });
    }
    const content = await page.content();
    return { content, status };
  } catch (err) {
    await page.screenshot({ path: `logs/${Date.now()}.png` });
    console.log(err);
    return { status };
  } finally {
    await browser.close();
  }
}

export { crawl };
