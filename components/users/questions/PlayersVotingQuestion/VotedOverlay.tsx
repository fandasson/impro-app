"use client";

import Image from "next/image";

import { PlayerWithPhotos } from "@/api/types.api";

type Props = {
    questionName: string;
    player: PlayerWithPhotos;
    onDismiss: () => void;
};

export const VotedOverlay = ({ questionName, player, onDismiss }: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden duration-300 animate-in fade-in slide-in-from-bottom-3">
            {/* Blurred dark backdrop */}
            <div className="absolute inset-0 backdrop-blur-[18px] [backdrop-filter:blur(18px)_brightness(0.45)_saturate(0.6)] [background:oklch(8%_0.01_260_/_0.7)]" />

            {/* Content */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center">
                {/* Question name + label */}
                <div className="flex w-full flex-col items-center gap-1.5 px-7 pt-7 text-center">
                    <p className="text-[12px] font-normal uppercase tracking-[0.06em] text-muted-foreground">postavu</p>
                    <p className="text-[18px] font-bold leading-snug text-foreground">{questionName}</p>
                    <p className="text-[12px] font-normal uppercase tracking-[0.06em] text-muted-foreground">
                        má hrát:
                    </p>
                </div>

                {/* Body photo — grows to fill available space, anchored at bottom */}
                <div className="flex min-h-0 flex-1 items-end justify-center">
                    <div className="relative h-[340px] w-[200px] overflow-hidden rounded-[120px_120px_16px_16px]">
                        <Image src={player.photos.body} alt={player.name} fill className="object-cover" />
                        {/* Amber glow at base */}
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[60px] [background:linear-gradient(to_top,var(--amber-dim),transparent)]" />
                    </div>
                </div>

                {/* Player name + motto */}
                <div className="flex w-full flex-col items-center gap-2 px-7 pt-6 text-center">
                    <p className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-foreground">
                        {player.name}
                    </p>
                    {player.motto && (
                        <p className="max-w-[240px] text-[16px] italic leading-relaxed text-primary">
                            &bdquo;{player.motto}&ldquo;
                        </p>
                    )}
                </div>
            </div>

            {/* Dismiss button — pinned to bottom */}
            <div className="relative z-10 px-7 pb-9 pt-8">
                <button
                    onClick={onDismiss}
                    className="w-full rounded-[14px] border border-white/[0.12] bg-white/[0.07] py-4 text-[15px] font-semibold text-foreground backdrop-blur-[10px] transition-colors hover:border-white/20 hover:bg-white/[0.12]"
                >
                    ZMĚNIT NÁZOR
                </button>
            </div>
        </div>
    );
};
