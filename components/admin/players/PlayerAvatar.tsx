"use client";
import Image from "next/image";
import { useState } from "react";

import { getPlayerPhotos } from "@/api/photos.api";
import type { Player } from "@/api/types.api";

const COLORS = [
    "bg-red-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
];

function pickColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xff;
    }
    return COLORS[hash % COLORS.length];
}

type Props = {
    player: Player;
    size?: number;
};

export function PlayerAvatar({ player, size = 40 }: Props) {
    const [imgError, setImgError] = useState(false);
    const { profile } = getPlayerPhotos(player.id);

    if (imgError) {
        return (
            <div
                className={`${pickColor(player.name)} flex shrink-0 items-center justify-center rounded-full font-bold text-white`}
                style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
                aria-label={player.name}
            >
                {player.name?.[0]?.toUpperCase() ?? "?"}
            </div>
        );
    }

    return (
        <div className="relative shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
            <Image
                src={profile}
                alt={player.name}
                fill
                sizes={`${size}px`}
                className="object-cover"
                onError={() => setImgError(true)}
            />
        </div>
    );
}
