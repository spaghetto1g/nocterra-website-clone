import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const ROOT_DOMAIN = "nocterra.gr"
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "admin",
  "api",
  "mail",
  "smtp",
  "imap",
  "pop",
  "ftp",
  "webmail",
])

function getSubdomain(hostHeader: string | null) {
  const host = (hostHeader || "").split(":")[0].toLowerCase()

  if (!host.endsWith(`.${ROOT_DOMAIN}`)) return ""

  const subdomain = host.slice(0, -(ROOT_DOMAIN.length + 1)).trim()
  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) return ""

  return subdomain
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const subdomain = getSubdomain(request.headers.get("host"))

  if (subdomain && !pathname.startsWith("/subdomain/")) {
    const url = request.nextUrl.clone()
    url.pathname = `/subdomain/${subdomain}`
    url.search = request.nextUrl.search
    return NextResponse.rewrite(url)
  }

  if (!pathname.startsWith("/admin")) {
    return response
  }

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/signup" ||
    pathname.startsWith("/auth/")
  ) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
}
