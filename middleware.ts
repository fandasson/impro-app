import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);

    // TODO: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#nextjs-middleware

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getUser();

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
