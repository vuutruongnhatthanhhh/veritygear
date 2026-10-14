import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { createClient as createPublicClient } from "@/lib/supabase/public";
import { toCanonicalPath, toEnglishPath } from "@/lib/localizedPaths";

const intlMiddleware = createIntlMiddleware(routing);

const BYPASS_COOKIE = "vg_bypass";
const BYPASS_PARAM = "vg_key";
const LOCK_CACHE_MS = 20_000;

type LockState = { isLocked: boolean; bypassCode: string; expiresAt: number };

// Module-scope cache — Edge Middleware instances stay warm across requests,
// so this avoids hitting Supabase on every single page load just to check
// the lock flag. Worst case, a lock toggle in admin takes up to 20s to
// propagate to visitors, which is fine for a maintenance-mode switch.
let lockCache: LockState | null = null;

async function getLockState(): Promise<LockState> {
  const now = Date.now();
  if (lockCache && lockCache.expiresAt > now) return lockCache;

  try {
    const supabase = await createPublicClient();
    const { data } = await supabase.from("site_lock").select("is_locked, bypass_code").eq("id", 1).single();
    lockCache = {
      isLocked: data?.is_locked ?? false,
      bypassCode: data?.bypass_code ?? "",
      expiresAt: now + LOCK_CACHE_MS,
    };
  } catch {
    // Never let a lock-check failure take the whole site down.
    lockCache = { isLocked: false, bypassCode: "", expiresAt: now + LOCK_CACHE_MS };
  }
  return lockCache;
}

export async function proxy(request: NextRequest) {
  const lock = await getLockState();
  const bypassParam = request.nextUrl.searchParams.get(BYPASS_PARAM);
  const hasValidBypassParam = !!lock.bypassCode && bypassParam === lock.bypassCode;
  const hasValidBypassCookie = !!lock.bypassCode && request.cookies.get(BYPASS_COOKIE)?.value === lock.bypassCode;

  if (lock.isLocked && !hasValidBypassParam && !hasValidBypassCookie) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  const response = intlMiddleware(request);

  if (hasValidBypassParam) {
    response.cookies.set(BYPASS_COOKIE, lock.bypassCode, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  // `request.nextUrl.pathname` is the real public URL (e.g. "/en/account"),
  // which differs from the canonical "/tai-khoan" route name since English
  // pages now have their own translated path — normalize back to canonical
  // before the prefix check below.
  const pathWithoutLocale =
    request.nextUrl.pathname.replace(/^\/(vi|en)(?=\/|$)/, "") || "/";
  const canonicalPath = toCanonicalPath(pathWithoutLocale);
  if (!canonicalPath.startsWith("/tai-khoan")) return response;

  const locale = request.nextUrl.pathname.startsWith("/en") ? "en" : "vi";
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginPath = locale === "en" ? toEnglishPath("/dang-nhap") : "/dang-nhap";
    const url = new URL(`${localePrefix}${loginPath}`, request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
