import { RenderSide, Store } from "./Store.ts";

export const Libro: Store = {
  name: "Libro",
  renderSide: RenderSide.Server,
  link: "https://www.libro.at/service/ps5/",
  matcher: {
    outOfStock: [
      {
        contains:
          `<strong>Vielen Dank an alle, die eine PlayStation 5 bestellt haben.`,
      },
    ],
  },
};
