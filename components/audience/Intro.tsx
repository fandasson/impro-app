import { QRCodeSVG } from "qrcode.react";

import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
};
export const Intro = ({ performance }: Props) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${performance.url_slug}`;
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <h1 className={"text-center text-xl"}>{performance.name}</h1>
            <h2 className={"text-center text-2xl font-bold"}>
                Chcete ovlivnit představení?
                <br />
                Skenujte 👇
            </h2>
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
            <pre className={"font-mono text-xl"}>{url}</pre>
        </div>
    );
};
