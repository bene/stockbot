# StockBot

You can use StockBot to get notified when a product (PS5) is available. It's
intended for personal use only. Don't be unkind and use it for scalping.
Currently, StockBot only supports stores which are server-side rendered.

## Usage

To configure notifications, create a `.env` file and add the variables for the
service you want. Have a look at the `.env.example` file to get the variable
names you need. To start the bot install [Deno](https://deno.land/#installation)
and run:

```
deno run -A main.ts
```

Or create a binary:

```
deno compile -A main.ts
```

## Development

To add a new store, create a file in the `stores` folder. Then register the new
store in the `src/environment.ts` file. As long as there are no docs, have a
look at the `stores/Conrad.ts` store as an example.

Make sure to use Deno's formatter before opening a PR:

```
deno fmt
```

### Docker
```
docker build -t bene/stockbot:latest .
```

<div style="text-align: center;width: 100%; margin-top: 25px">Made with ☕️ by bene.</div>
