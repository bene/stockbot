function logInStock(store) {
  console.log(
    `[${new Date().toTimeString().substring(0, 8)}] ${
      store.name.padStart(14, " ")
    }: %cIN STOCK`,
    "color:green",
  );
  notifyDiscord(store);
}

function logIssue(store, message) {
  console.log(
    `[${new Date().toTimeString().substring(0, 8)}] ${
      store.name.padStart(14, " ")
    }: %c${message}`,
    "color:red",
  );
}

function logOutOfStock(store) {
  console.log(
    `[${new Date().toTimeString().substring(0, 8)}] ${
      store.name.padStart(14, " ")
    }: %cOUT OF STOCK`,
    "color:grey",
  );
}

function notifyDiscord(store) {
  fetch(
    "https://discord.com/api/webhooks/809805717916614656/vq6RHVxlClS1DEhgHGmLtty9y3x7BeuUiNQsWJXf3jbss__gd_vDUqvZ1OUap-6hYdy_",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "StockBot",
        "embeds": [
          {
            color: "14177041",
            fields: [
              {
                "name": "Store",
                "value": store.name,
              },
              {
                "name": "Link",
                "value": store.link,
              },
              {
                "name": "Status",
                "value": "IN STOCK",
              },
            ],
          },
        ],
      }),
    },
  ).catch((_) => {
    console.log("Could not send notification via Discord.");
  });
}

export { logInStock, logIssue, logOutOfStock };
