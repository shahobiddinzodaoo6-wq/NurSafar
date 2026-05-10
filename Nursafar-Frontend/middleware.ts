import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlProxy = createMiddleware(routing);

export function proxy(request: Request) {
    return intlProxy(request as any);
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
