import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const Libro: Store = {
  name: "Libro",
  renderSide: RenderSide.Server,
  fetchMode: FetchMode.Parallel,
  products: [
    {
      name: "PlayStation",
      url: "https://www.libro.at/service/ps5/",
      matcher: (content: string) => {
        return !content.includes(
          "Vielen Dank an alle, die eine PlayStation 5 bestellt haben."
        );
      },
    },
  ],
};

export default Libro;
