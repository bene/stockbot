import { RenderSide, Store } from "./Store.ts";

export const Conrad: Store = {
  name: "Conrad",
  renderSide: RenderSide.Server,
  link: "https://www.conrad.de/de/aktionen/product-promotions/sony-ps5.html",
  matcher: {
    outOfStock: [
      {
        contains: `- AKTUELL AUSVERKAUFT -`,
      },
    ],
  },
};
