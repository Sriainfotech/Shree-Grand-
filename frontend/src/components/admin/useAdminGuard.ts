import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { clearToken, getMe, getToken, type AdminUser } from "@/lib/adminApi";

/**
 * Client-side auth guard shared by every /admin/* page (the token lives in
 * localStorage, so this can't run during SSR — it checks on mount and
 * redirects to /admin/login if there's no valid session).
 */
export function useAdminGuard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!getToken()) {
      void navigate({ to: "/admin/login" });
      return;
    }

    getMe()
      .then((me) => {
        if (!cancelled) {
          setUser(me);
          setReady(true);
        }
      })
      .catch(() => {
        clearToken();
        void navigate({ to: "/admin/login" });
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { user, ready };
}
