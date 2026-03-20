import { XIcon } from "lucide-react";
import React, { useState } from "react";

import { CharacterInput } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type Props = {
    characters: CharacterInput[];
    answeredCharacterIds: number[];
    onCharactersChange: (characters: CharacterInput[]) => void;
};

export const ManageCharacters = ({ characters, answeredCharacterIds, onCharactersChange }: Props) => {
    const [newName, setNewName] = useState("");

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onCharactersChange([...characters, { name: trimmed }]);
        setNewName("");
    };

    const handleRemove = (index: number) => {
        onCharactersChange(characters.filter((_, i) => i !== index));
    };

    const handleNameChange = (index: number, name: string) => {
        const updated = characters.map((c, i) => (i === index ? { ...c, name } : c));
        onCharactersChange(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Label className="font-medium">Postavy</Label>
            {characters.map((char, index) => {
                const isProtected = char.id !== undefined && answeredCharacterIds.includes(char.id);
                return (
                    <div key={char.id ?? `new-${index}`} className="flex items-center gap-2">
                        <Input
                            value={char.name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            placeholder="Název postavy"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            disabled={isProtected}
                            aria-label={`Odebrat postavu ${char.name}`}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
            <div className="flex items-center gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nová postava"
                />
                <Button type="button" variant="outline" onClick={handleAdd} disabled={!newName.trim()}>
                    Přidat
                </Button>
            </div>
        </div>
    );
};
