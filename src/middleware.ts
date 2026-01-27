import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Create an empty response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Create the Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. Check the User's Session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. Protect Routes: If NO user, kick them to Login
    if (!user && (request.nextUrl.pathname.startsWith('/horizon') || request.nextUrl.pathname.startsWith('/buckets'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 5. Redirect Logic: If User EXISTS, kick them to Dashboard
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/horizon', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}