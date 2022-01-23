import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const Electronic4You: Store = {
  name: "Electronic4You",
  renderSide: RenderSide.Server,
  fetchMode: FetchMode.Parallel,
  products: [
    {
      name: "PlayStation",
      url: "https://www.electronic4you.at/ps5",
      matcher: (content: string) => {
        return !content.includes(
          "Derzeit sind leider alle PlayStation 5 ausverkauft. Wir bitten um Ihr Verständnis."
        );
      },
    },
  ],
};

export default Electronic4You;
