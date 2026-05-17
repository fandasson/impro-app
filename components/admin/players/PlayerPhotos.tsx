"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { uploadPlayerPhoto } from "@/api/players.api";
import { getPlayerPhotos } from "@/api/photos.api";
import type { Player } from "@/api/types.api";
import { Button } from "@/components/ui/Button";

function toJpeg(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Konverze na JPEG selhala"))),
                "image/jpeg",
                0.92,
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Načtení obrázku selhalo"));
        };
        img.src = objectUrl;
    });
}

type SlotProps = {
    playerId: number;
    kind: "profile" | "body";
    serverUrl: string;
    label: string;
};

function PhotoSlot({ playerId, kind, serverUrl, label }: SlotProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [cacheBust, setCacheBust] = useState(0);
    const [serverImgError, setServerImgError] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setUploadError(null);
    }

    function handleUpload() {
        if (!selectedFile) return;
        setUploadError(null);
        startTransition(async () => {
            try {
                const blob = await toJpeg(selectedFile);
                const fd = new FormData();
                fd.append("photo", blob, `${kind}.jpg`);
                const result = await uploadPlayerPhoto(playerId, kind, fd);
                if (!result.success) {
                    setUploadError(result.error);
                    return;
                }
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setSelectedFile(null);
                if (inputRef.current) inputRef.current.value = "";
                setServerImgError(false);
                setCacheBust((n) => n + 1);
            } catch (e) {
                setUploadError(e instanceof Error ? e.message : "Chyba při nahrávání");
            }
        });
    }

    const isPreview = !!previewUrl;
    const displayUrl = previewUrl ?? `${serverUrl}?t=${cacheBust}`;

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium">{label}</p>
            <div className="relative h-48 w-36 overflow-hidden rounded-lg border border-border bg-muted">
                {!serverImgError || isPreview ? (
                    <Image
                        key={displayUrl}
                        src={displayUrl}
                        alt={label}
                        fill
                        sizes="144px"
                        className="object-cover"
                        onError={() => {
                            if (!isPreview) setServerImgError(true);
                        }}
                        unoptimized={isPreview}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Bez fotografie
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label={`Vybrat fotografii: ${label}`}
            />
            <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => inputRef.current?.click()}>
                    Nahrát .JPG fotku
                </Button>
                {selectedFile && (
                    <Button size="sm" type="button" onClick={handleUpload} disabled={isPending}>
                        {isPending ? "Nahrávám..." : "Nahrát"}
                    </Button>
                )}
            </div>
            {selectedFile && !isPending && (
                <p className="text-xs text-muted-foreground">Vybraný: {selectedFile.name}</p>
            )}
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
        </div>
    );
}

type Props = {
    player: Player;
};

export function PlayerPhotos({ player }: Props) {
    const { profile, body } = getPlayerPhotos(player.id);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Fotografie</h2>
            <div className="flex flex-wrap gap-8">
                <PhotoSlot playerId={player.id} kind="profile" serverUrl={profile} label="Profilová fotografie" />
                <PhotoSlot playerId={player.id} kind="body" serverUrl={body} label="Celkové foto" />
            </div>
        </div>
    );
}
