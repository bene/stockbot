import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const Conrad: Store = {
  name: "Conrad",
  renderSide: RenderSide.Server,
  fetchMode: FetchMode.Parallel,
  interval: 10000,
  products: [
    {
      name: "PlayStation",
      url: "https://www.conrad.at/de/angebote/sony-ps5.html",
      matcher: (content: string) => {
        return !content.includes(
          "Aufgrund der sehr hohen Nachfrage ist die Playstation 5 auch bei Conrad momentan leider ausverkauft."
        );
      },
    },
  ],
};

export default Conrad;
