import { INotificationService } from "../NotificationService.ts";

export class Discord implements INotificationService {
  name = "Discord";
  webhookURL: string;

  constructor(webhookURL: string) {
    this.webhookURL = webhookURL;
  }

  sendRawMessage(message: string): void {
    fetch(this.webhookURL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "StockBot",
        embeds: [
          {
            color: "3447003",
            fields: [
              {
                name: "Info",
                value: message,
              },
            ],
          },
        ],
      }),
    }).catch((_) => {
      console.log("Could not send notification via Discord.");
    });
  }

  notify(productName: string, storeName: string, url: string): void {
    fetch(this.webhookURL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "StockBot",
        embeds: [
          {
            color: "1879160",
            fields: [
              {
                name: "Store",
                value: storeName,
              },
              {
                name: "Product",
                value: productName,
              },
              {
                name: "Link",
                value: url,
              },
              {
                name: "Status",
                value: "IN STOCK",
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
