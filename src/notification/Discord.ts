import { StockStatus, Store } from "../../stores/Store.ts";
import { INotificationService } from "./NotificationService.ts";

export class Discord implements INotificationService {
  name: string = "Discord";
  webhookURL: string;

  constructor(webhookURL: string) {
    this.webhookURL = webhookURL;
  }

  notify(status: StockStatus, store: Store): void {
    fetch(this.webhookURL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "StockBot",
        embeds: [
          {
            color: status === StockStatus.InStock ? "1879160" : "15605837",
            fields: [
              {
                name: "Store",
                value: store.name,
              },
              {
                name: "Link",
                value: store.link,
              },
              {
                name: "Status",
                value: status === StockStatus.InStock
                  ? "IN STOCK"
                  : "OUT OF STOCK",
              },
            ],
          },
        ],
      }),
    }).catch((_) => {
      console.log("Could not send notification via Discord.");
    });
  }
}
