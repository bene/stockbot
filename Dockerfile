FROM denoland/deno

WORKDIR /app

COPY . .
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]