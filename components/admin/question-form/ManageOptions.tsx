import { XIcon } from "lucide-react";
import React, { useState } from "react";

import { OptionInput } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type Props = {
    options: OptionInput[];
    answeredOptionIds: number[];
    onOptionsChange: (options: OptionInput[]) => void;
};

export const ManageOptions = ({ options, answeredOptionIds, onOptionsChange }: Props) => {
    const [newOption, setNewOption] = useState("");

    const handleAdd = () => {
        const trimmed = newOption.trim();
        if (!trimmed) return;
        onOptionsChange([...options, { option: trimmed }]);
        setNewOption("");
    };

    const handleRemove = (index: number) => {
        onOptionsChange(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index: number, option: string) => {
        onOptionsChange(options.map((o, i) => (i === index ? { ...o, option } : o)));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Label className="font-medium">Možnosti</Label>
            {options.map((opt, index) => {
                const isProtected = opt.id !== undefined && answeredOptionIds.includes(opt.id);
                return (
                    <div key={opt.id ?? `new-${index}`} className="flex items-center gap-2">
                        <Input
                            value={opt.option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder="Text možnosti"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            disabled={isProtected}
                            aria-label={`Odebrat možnost ${opt.option}`}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
            <div className="flex items-center gap-2">
                <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nová možnost"
                />
                <Button type="button" variant="outline" onClick={handleAdd} disabled={!newOption.trim()}>
                    Přidat
                </Button>
            </div>
        </div>
    );
};
