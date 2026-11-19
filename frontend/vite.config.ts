import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
  nitro: {
    preset: process.env.VERCEL ? "vercel" : undefined,
  },
  // Hosted on Vercel only (no Cloudflare) — pin explicitly since Nitro's
  // platform auto-detect otherwise falls back to the cloudflare-module
  // preset, which crashes at runtime on Vercel (missing CF bindings).
  nitro: { preset: "vercel" },
});
