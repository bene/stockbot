export interface Product {
  name: string;
  url: string;
  matcher: (content: string) => boolean;
  waitForFunction?: string;
}

export enum RenderSide {
  Client,
  Server,
}

export enum FetchMode {
  Parallel,
  Serial,
}

export enum StockStatus {
  InStock = "IN STOCK",
  OutOfStock = "OUT OF STOCK",
}

export type Store = {
  name: string;
  fetchMode: FetchMode;
  renderSide: RenderSide;
  products: Product[];
  interval: number;
};
