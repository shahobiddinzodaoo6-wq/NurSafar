import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setCredentials, setHydrated } from "../store/authSlice";
import { storage } from "../utils/storage";
import { decodeJwt, isTokenExpired } from "../utils/jwt";
import type { AuthUser } from "../types";

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function hydrate() {
      try {
        const token = await storage.getToken();

        if (!token || isTokenExpired(token)) {
          await storage.clearAll();
          dispatch(setHydrated());
          return;
        }

        const user = await storage.getUser<AuthUser>();
        if (user) {
          dispatch(setCredentials({ user, token }));
          return;
        }

        // Fallback: reconstruct user from JWT payload
        const payload = decodeJwt(token);
        if (payload) {
          const derived: AuthUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          };
          dispatch(setCredentials({ user: derived, token }));
          return;
        }

        await storage.clearAll();
        dispatch(setHydrated());
      } catch {
        await storage.clearAll();
        dispatch(setHydrated());
      }
    }

    hydrate();
  }, [dispatch]);

  return <>{children}</>;
}
