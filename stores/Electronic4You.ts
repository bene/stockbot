import { RenderSide, Store } from "./Store.ts";

export const Electronic4You: Store = {
  name: "Electronic4You",
  renderSide: RenderSide.Server,
  link: "https://www.electronic4you.at/ps5",
  matcher: {
    outOfStock: [
      {
        contains:
          `Derzeit sind leider alle PlayStation 5 ausverkauft. Wir bitten um Ihr Verständnis.`,
      },
    ],
  },
};
