import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { COOKIE_USER_ID } from "@/utils/constants.utils";

export async function GET(_: Request, response: Response) {
    const cookieStore = cookies();
    let userId = cookieStore.get(COOKIE_USER_ID)?.value;

    if (!userId) {
        userId = uuidv4();
        cookieStore.set(COOKIE_USER_ID, userId);
    }
    return NextResponse.json(userId);
}
