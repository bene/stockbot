import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const MediaMarkt: Store = {
  name: "MediaMarkt",
  renderSide: RenderSide.Server,
  fetchMode: FetchMode.Serial,
  products: [
    {
      name: "PlayStation",
      url: "https://www.mediamarkt.at/de/product/_sony-playstation%C2%AE5-digital-1797340.html",

      matcher: (content: string) => {
        return !content.includes("Dieser Artikel ist bald wieder verfügbar");
      },
    },
    {
      name: "Xbox",
      url: "https://www.mediamarkt.at/de/product/_microsoft-xbox-series-x-1-tb-1802067.html",
      matcher: (content: string) => {
        return !content.includes("Dieser Artikel ist bald wieder verfügbar");
      },
    },
  ],
};

export default MediaMarkt;
