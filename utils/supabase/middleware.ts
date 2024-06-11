import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // refreshing the auth token
    await supabase.auth.getUser();

    return response;
}
