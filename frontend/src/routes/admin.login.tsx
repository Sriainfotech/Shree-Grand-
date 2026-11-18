import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { login, setToken } from "@/lib/adminApi";
import { ApiRequestError } from "@/config/api";
import { images } from "@/data/images";
import { site } from "@/config/site";

// Not linked from any nav/footer, excluded from the sitemap, and marked
// noindex below — reachable only if you already know the URL.
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Sign in" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { token } = await login(loginId, password);
      setToken(token);
      void navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-forest-deep px-4">
      <img
        src={images.aerial}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/95 via-forest-deep/90 to-forest-deep"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 border border-accent/20 bg-card p-8 shadow-xl"
      >
        <div className="text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">
            {site.name}
          </p>
          <h1 className="display-lg mt-3">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Username or email, and your password.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-id">Username or email</Label>
          <Input
            id="login-id"
            required
            autoFocus
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
