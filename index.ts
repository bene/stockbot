import { RenderSide, StockStatus, Store } from "./stores/Store.ts";
import { maxLineLength, stores } from "./src/environment.ts";
import { log, logIssue } from "./src/logger.ts";

function main() {
  loop().catch((err) => {
    console.error(err);
  });
}

async function loop() {
  while (true) {
    console.log("".padStart(maxLineLength, "="));
    await Promise.all(stores.map(async (s: Store) => await check(s)));
    await sleep(10 * 1000);
  }
}

async function check(store: Store) {
  if (store.renderSide === RenderSide.Server) {
    const res = await fetch(store.link, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
      },
    });

    if (!res.ok) {
      logIssue(store, `HTTP Error ${res.status}`);
      return;
    }

    const text = await res.text();

    if (
      !!store.matcher?.outOfStock &&
      store.matcher.outOfStock.every((c) => text.includes(c.contains!))
    ) {
      log(StockStatus.OutOfStock, store);
    } else {
      log(StockStatus.InStock, store);
    }
  }
}

function sleep(milliseconds: number) {
  return new Promise<any>((resolve) => setTimeout(resolve, milliseconds));
}

main();
