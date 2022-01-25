import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const Nvidia: Store = {
  name: "Nvidia",
  renderSide: RenderSide.Client,
  fetchMode: FetchMode.Serial,
  interval: 12000,
  products: [
    {
      name: "RTX 3000 Series",
      url: "https://store.nvidia.com/de-de/geforce/store/?page=1&limit=9&locale=de-de&gpu=RTX%203070,RTX%203070%20Ti,RTX%203080,RTX%203060,RTX%203060%20Ti&manufacturer=NVIDIA",
      matcher: (content) => {
        const doc = new DOMParser().parseFromString(content, "text/html");
        const elements = doc?.querySelectorAll(
          ".product-details-list-tile, .featured-container-xl"
        )!;

        for (const element of elements) {
          const content = element.textContent;
          if (
            !content.includes("DERZEIT NICHT VERFÜGBAR") ||
            content.includes("JETZT KAUFEN")
          ) {
            return true;
          }
        }

        return content.includes("JETZT KAUFEN");
      },
    },
  ],
};

export default Nvidia;
