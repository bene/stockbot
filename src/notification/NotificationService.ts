import { StockStatus, Store } from "../../stores/Store.ts";

export interface INotificationService {
  name: string;
  notify(status: StockStatus, store: Store): void;
}
