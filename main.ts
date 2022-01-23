import "https://deno.land/x/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.122.0/http/server.ts";
import * as log from "https://deno.land/std@0.122.0/log/mod.ts";

import { crawl } from "./crawler.ts";
import { Store } from "./src/Store.ts";

const stores: Store[] = [];

let sdtInterval = 10000;

if (Deno.env.get("INTERVAL")) {
  sdtInterval = parseInt(Deno.env.get("INTERVAL")!);
}

// Create log file
const logsFile = `./logs/${Date.now()}.txt`;
await Deno.mkdir("./logs", {
  recursive: true,
});
//await Deno.writeTextFile(logsFile, "");

// Register stores
for await (const dirEntry of Deno.readDir("stores")) {
  const store: Store = (await import(`./stores/${dirEntry.name}`)).default;
  stores.push(store);
}

const fileHandler = new log.handlers.FileHandler("INFO", {
  filename: logsFile,
});

await log.setup({
  handlers: {
    file: fileHandler,
  },
});

log.critical("Hallo");
fileHandler.flush();

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
}

// Index of the last crawled product for serial mode stores
const lastCrawledProduct: Record<string, CrawlRecord> = {};

// Loop
setInterval(() => {
  stores.map(async (store) => {
    const interval = Math.max(store.minInterval ?? 0, sdtInterval);
    const now = Date.now();

    if (
      !lastCrawledProduct[store.name] ||
      (lastCrawledProduct[store.name].done &&
        lastCrawledProduct[store.name].time + interval < now)
    ) {
      const lastIndex = lastCrawledProduct[store.name]?.productIndex ?? 0;
      const nextIndex =
        lastIndex + 1 < store.products.length ? lastIndex + 1 : 0;
      const product = store.products[nextIndex];
      lastCrawledProduct[store.name] = {
        ...lastCrawledProduct[store.name],
        done: false,
      };

      await crawl(
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
      };
    }
  });
}, 100);

// Serve status page
serve(
  async () => {
    const lines = await Deno.readTextFile(logsFile);
    return new Response(new Date().toLocaleTimeString());
  },
  { port: 8000 }
);
