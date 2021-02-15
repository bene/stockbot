import { INotificationService } from "./notification/NotificationService.ts";
import { StockStatus, Store } from "../stores/Store.ts";
import { maxStoreNameLength, notificationServices } from "./environment.ts";

export function log(status: StockStatus, store: Store) {
  console.log(
    `[${new Date().toTimeString().substring(0, 8)}] ${
      store.name.padStart(
        maxStoreNameLength,
        " ",
      )
    }: %c${status.toString()}`,
    status === StockStatus.InStock ? "color:green" : "color:grey",
  );

  if (status === StockStatus.InStock) {
    notificationServices.forEach((ns: INotificationService) =>
      ns.notify(StockStatus.InStock, store)
    );
  }
}

export function logIssue(store: Store, message: string) {
  console.log(
    `[${new Date().toTimeString().substring(0, 8)}] ${
      store.name.padStart(
        maxStoreNameLength,
        " ",
      )
    }: %c${message}`,
    "color:red",
  );
}
