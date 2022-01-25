import "https://deno.land/x/dotenv/load.ts";
import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { serve } from "https://deno.land/std@0.122.0/http/server.ts";

import { crawl } from "./crawler.ts";
import { userAgent } from "./config.ts";
import { Store, Product } from "./src/Store.ts";
import type { Response } from "./crawler.ts";

const stores: Store[] = [];

// Register stores
for await (const dirEntry of Deno.readDir("stores")) {
  const store: Store = (await import(`./stores/${dirEntry.name}`)).default;
  stores.push(store);
}

// Print banner
console.log(`
   _____ __             __   ____        __ 
  / ___// /_____  _____/ /__/ __ )____  / /_
  \\__ \\/ __/ __ \\/ ___/ //_/ __  / __ \\/ __/
 ___/ / /_/ /_/ / /__/ ,< / /_/ / /_/ / /_  
/____/\\__/\\____/\\___/_/|_/_____/\\____/\\__/  

`);

for (const store of stores) {
  console.log(store.name);
  for (let i = 0; i < store.products.length; i++) {
    console.log(
      i + 1 < store.products.length ? "├─" : "└─",
      store.products[i].name
    );
  }
  console.log();
}

interface CrawlRecord {
  productIndex: number;
  time: number;
  done: boolean;
  response?: Response;
}

// Index of the last crawled product for serial mode stores
const lastCrawledProduct: Record<string, CrawlRecord> = {};
const totalCrawls: Record<string, number> = {};

// Open every product url at least once with chrome
async function initialOpen() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  await Promise.allSettled(
    stores
      .reduce((prev, curr) => [...prev, ...curr.products], <Product[]>[])
      .map(async (product) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(userAgent);
        await page.goto(product.url, { waitUntil: "networkidle2" });
        await sleep(5000);
        await page.close();
      })
  );

  browser.close();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await initialOpen();

// Loop
setInterval(() => {
  const now = Date.now();

  stores.map(async (store) => {
    if (
      !lastCrawledProduct[store.name] ||
      (lastCrawledProduct[store.name].done &&
        lastCrawledProduct[store.name].time + store.interval < now)
    ) {
      lastCrawledProduct[store.name] = {
        ...lastCrawledProduct[store.name],
        done: false,
      };

      const lastIndex = lastCrawledProduct[store.name]?.productIndex ?? 0;
      const nextIndex =
        lastIndex + 1 < store.products.length ? lastIndex + 1 : 0;
      const product = store.products[nextIndex];

      const response = await crawl(
        product.name,
        store.name,
        product.url,
        store.renderSide,
        product.matcher,
        product.waitForFunction
      );
      lastCrawledProduct[store.name] = {
        productIndex: nextIndex,
        time: now,
        done: true,
        response,
      };
      if (totalCrawls[store.name]) {
        totalCrawls[store.name] = totalCrawls[store.name] + 1;
      } else {
        totalCrawls[store.name] = 1;
      }
    }
  });
}, 100);

// Serve status page
serve(
  (request) => {
    const url = new URL(request.url);
    const [store, plain] = url.pathname.substring(1).split("/");
    if (Object.hasOwn(lastCrawledProduct, store)) {
      const headers = new Headers();
      headers.set(
        "Content-Type",
        `${plain ? "text/plain" : "text/html"}; charset=UTF-8`
      );
      return new Response(lastCrawledProduct[store].response?.content, {
        headers,
      });
    }

    const infoResponse = Object.entries(lastCrawledProduct).map(
      ([storeName, lastCrawl]) => {
        const date = new Date();
        date.setTime(lastCrawl.time);
        return {
          storeName: storeName,
          totalCrawls: totalCrawls[storeName],
          done: lastCrawl.done,
          lastCrawl: {
            status: lastCrawl.response?.status,
            date: date.toLocaleString(),
            product: stores.find((s) => s.name === storeName)?.products[
              lastCrawl.productIndex
            ]?.name,
          },
        };
      }
    );

    return new Response(JSON.stringify(infoResponse, null, "  "));
  },
  { port: 8000 }
);
