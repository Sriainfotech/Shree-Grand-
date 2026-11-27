import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
    router: {
      // Off by default — every route (incl. booking/payment/admin) was
      // shipping in one ~1.3MB bundle on every page. This splits each
      // route's component into its own chunk, loaded only when visited.
      autoCodeSplitting: true,
    },
  },
  nitro: {
    preset: process.env.VERCEL ? "vercel" : undefined,
  },
});
