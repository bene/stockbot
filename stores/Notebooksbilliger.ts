import { FetchMode, RenderSide, Store } from "../src/Store.ts";

const Notebooksbilliger: Store = {
  name: "Notebooksbilliger",
  renderSide: RenderSide.Server,
  fetchMode: FetchMode.Serial,
  products: [
    {
      name: "RTX 3070",
      url: "https://www.notebooksbilliger.de/pc+hardware/grafikkarten/nvidia/geforce+rtx+3070+nvidia",
      matcher: (content: string) => {
        return content.includes("549,00");
      },
    },
    {
      name: "RTX 3080",
      url: "https://www.notebooksbilliger.de/pc+hardware/grafikkarten/nvidia/geforce+rtx+3080+nvidia",
      matcher: (content: string) => {
        return content.includes("759,00");
      },
    },
  ],
};

export default Notebooksbilliger;
