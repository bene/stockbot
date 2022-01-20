import { RenderSide, Store } from "./Store.ts";

export const MediaMarkt: Store = {
  name: "MediaMarkt",
  renderSide: RenderSide.Server,
  link:
    "https://www.mediamarkt.at/de/product/_sony-playstation%C2%AE5-digital-1797340.html",
  matcher: {
    outOfStock: [
      {
        contains: `Dieser Artikel ist bald wieder verfügbar`,
      },
    ],
  },
};
