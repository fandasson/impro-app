import { cookies } from "next/headers";
import { QRCodeSVG } from "qrcode.react";

import { EmptyScreen } from "@/app/screen/EmptyScreen";
import { EmptyScreen } from "@/components/screens/EmptyScreen";
import { Intro } from "@/components/screens/Intro";
import { createClient } from "@/utils/supabase/server";

export default async function ScreenIndex() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performance } = await supabase
        .from("performances")
        .select("*")
        .eq("state", "intro")
        .limit(1)
        .single();

    if (!performance) {
        return <EmptyScreen />;
    }

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QRCodeSVG
                value={url}
                bgColor={"#000000"}
                fgColor={"#FFFFFF"}
                size={256}
                imageSettings={{
                    src: "/qr-logo.png",
                    width: 54, // 540 * 0.1
                    height: 83, // 830 * 0.1
                    excavate: false,
                }}
            />
            <h2 className={"font-mono text-xl"}>{url}</h2>
        </div>
    );
}
