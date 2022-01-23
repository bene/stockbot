import { Discord } from "./notification/Discord.ts";

export interface INotificationService {
  name: string;
  notify(productName: string, storeName: string, url: string): void;
  sendRawMessage(message: string): void;
}

class NotificationService implements INotificationService {
  name = "NotificationService";
  services: INotificationService[] = [];

  constructor() {
    if (Deno.env.get("DISCORD_WEBHOOK_URL")) {
      this.services.push(new Discord(Deno.env.get("DISCORD_WEBHOOK_URL")!));
    }
  }

  notify(productName: string, storeName: string, url: string): void {
    this.services.map((service) => service.notify(productName, storeName, url));
  }

  sendRawMessage(message: string): void {
    this.services.map((service) => service.sendRawMessage(message));
  }

  getServiceNames() {
    return this.services.map((s) => s.name).join(", ");
  }
}

export { NotificationService };
