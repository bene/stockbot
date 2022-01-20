import { RenderSide, Store } from "./Store.ts";

export const Conrad: Store = {
  name: "Conrad",
  renderSide: RenderSide.Server,
  link: "https://www.conrad.at/de/angebote/sony-ps5.html",
  matcher: {
    outOfStock: [
      {
        contains:
          `Aufgrund der sehr hohen Nachfrage ist die Playstation 5 auch bei Conrad momentan leider ausverkauft.`,
      },
    ],
  },
};
