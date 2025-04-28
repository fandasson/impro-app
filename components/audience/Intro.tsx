import { QRCodeSVG } from "qrcode.react";

import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
};
export const Intro = ({ performance }: Props) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}`.replace("https://", "");
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <h1 className={"text-center text-xl"}>{performance.name}</h1>
            <h2 className={"text-center text-2xl font-bold"}>Zapojte se do představení</h2>
            <QRCodeSVG value={url} bgColor={"#000000"} fgColor={"#FFFFFF"} size={330} />
            <pre className={"font-mono text-4xl"}>{url}</pre>
        </div>
    );
};
