export type ContainsCondition = {
  contains?: string;
};

export type Matcher = {
  outOfStock?: [ContainsCondition];
  inStock?: [ContainsCondition];
};

export enum RenderSide {
  Client,
  Server,
}

export enum StockStatus {
  InStock = "IN STOCK",
  OutOfStock = "OUT OF STOCK",
}

export type Store = {
  name: string;
  link: string;
  renderSide: RenderSide;
  matcher: Matcher;
};
