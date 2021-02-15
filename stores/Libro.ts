import { RenderSide, Store } from "./Store.ts";

export const Libro: Store = {
  name: "Libro",
  renderSide: RenderSide.Server,
  link: "https://www.libro.at/ps5",
  matcher: {
    outOfStock: [
      {
        contains:
          `<strong>Vielen Dank an alle, die eine PlayStation 5 bestellt haben. Wenn Sie keine Konsole bestellen konnten, besuchen Sie bitte weiterhin unsere Seite <a href="http://www.libro.at/PS5">www.libro.at/PS5</a>, um die neuesten Updates zu erhalten.</strong>`,
      },
    ],
  },
};
