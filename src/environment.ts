import "https://deno.land/x/dotenv/load.ts";

import { INotificationService } from "./notification/NotificationService.ts";
import { RenderSide, StockStatus, Store } from "../stores/Store.ts";
import { Conrad } from "../stores/Conrad.ts";
import { Libro } from "../stores/Libro.ts";
import { Electronic4You } from "../stores/Electronic4You.ts";
import { Discord } from "./notification/Discord.ts";

export let notificationServices: Array<INotificationService> = [];
export let stores: Array<Store> = [];
export let maxLineLength = 0;
export let maxStoreNameLength = 0;

// Register stores
stores.push(Conrad);
stores.push(Libro);
stores.push(Electronic4You);

// TODO: Implement client side rendered stores via Chromium
stores = stores.filter((s) => {
  if (s.renderSide === RenderSide.Client) {
    console.error(
      "%cClient side rendered stores are not implemented yet.",
      "color:red",
    );
    console.error(`%cRemoving store: ${s.name}`, "color:red");
    return false;
  }

  return true;
});

// Register notification services
if (!!Deno.env.get("DISCORD_WEBHOOK_URL")) {
  notificationServices.push(new Discord(Deno.env.get("DISCORD_WEBHOOK_URL")!));
}

// Print banner
console.log(`
   _____ __             __   ____        __ 
  / ___// /_____  _____/ /__/ __ )____  / /_
  \\__ \\/ __/ __ \\/ ___/ //_/ __  / __ \\/ __/
 ___/ / /_/ /_/ / /__/ ,< / /_/ / /_/ / /_  
/____/\\__/\\____/\\___/_/|_/_____/\\____/\\__/  

`);

// Print info
console.log(
  `Notification services: ${
    notificationServices
      .map((ns) => ns.name)
      .join(", ")
  }`,
);

console.log(`Stores: ${stores.map((ns) => ns.name).join(", ")}`);

// Set maxLineLength value
stores.forEach((s) => {
  if (s.name.length > maxStoreNameLength) {
    maxStoreNameLength = s.name.length;
  }
});

maxLineLength = maxStoreNameLength +
  StockStatus.OutOfStock.toString().length +
  3 +
  `[${new Date().toTimeString().substring(0, 8)}]`.length;
