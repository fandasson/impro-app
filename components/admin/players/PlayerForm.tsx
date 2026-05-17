"use client";

import { useActionState, useState } from "react";

import type { Player } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
    initialData?: Player;
    action: (prevState: unknown, formData: FormData) => Promise<unknown>;
    submitLabel?: string;
};

export function PlayerForm({ initialData, action, submitLabel = "Uložit" }: Props) {
    const [state, formAction, isPending] = useActionState(action, null);

    const [name, setName] = useState(initialData?.name ?? "");
    const [surname, setSurname] = useState(initialData?.surname ?? "");
    const [motto, setMotto] = useState(initialData?.motto ?? "");
    const [quest, setQuest] = useState(initialData?.quest ?? false);

    const formState = state as { error?: string; fieldErrors?: Record<string, string[]> } | null;

    return (
        <form action={formAction} className="space-y-6" aria-label="Formulář improvizátora">
            {initialData && <input type="hidden" name="id" value={initialData.id} />}
            <input type="hidden" name="quest" value={quest ? "true" : "false"} />

            <div>
                <Label htmlFor="name">Jméno *</Label>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={255}
                    placeholder="např. Jana"
                />
                {formState?.fieldErrors?.name && (
                    <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.name[0]}</p>
                )}
            </div>

            <div>
                <Label htmlFor="surname">Příjmení</Label>
                <Input
                    id="surname"
                    name="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    maxLength={255}
                    placeholder="např. Nováková"
                />
                {formState?.fieldErrors?.surname && (
                    <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.surname[0]}</p>
                )}
            </div>

            <div>
                <Label htmlFor="motto">Motto</Label>
                <Textarea
                    id="motto"
                    name="motto"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Krátké motto nebo bio improvizátora"
                />
                {formState?.fieldErrors?.motto && (
                    <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.motto[0]}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Switch
                    id="quest-switch"
                    checked={quest}
                    onCheckedChange={setQuest}
                    aria-label="Host"
                />
                <Label htmlFor="quest-switch">Host (označí improvizátora jako hosta)</Label>
            </div>

            {formState?.error && !formState?.fieldErrors && (
                <div role="alert" aria-live="assertive" className="rounded border border-red-800 bg-red-950 p-4">
                    <p className="text-sm text-red-200">{formState.error}</p>
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Ukládání..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
