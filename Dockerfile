FROM denoland/deno

WORKDIR /app

COPY . .
RUN PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.2/install.ts
RUN deno cache --unstable main.ts

CMD ["run", "-A", "--unstable", "main.ts"]