import { logInStock, logIssue, logOutOfStock } from "./src/logger.js";
import stores from "./stores/index.js";

function main() {
  loop().catch((err) => {
    console.log(err);
  });
}

async function loop() {
  const header = "".padStart(39, "=");

  while (true) {
    console.log(header);
    await Promise.all(stores.map(async (s) => await check(s)));
    await sleep(10 * 1000);
  }
}

async function check(store) {
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
    !!store.outOfStock?.contains && text.includes(store.outOfStock.contains)
  ) {
    logOutOfStock(store);
  } else {
    logInStock(store);
  }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

main();
