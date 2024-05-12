"use client";
import { HandIcon, NotebookPenIcon, TextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { fetchAvailablePlayers } from "@/api/performances.api";
import { getNewIndexOrder } from "@/api/questions.api";
import { Player, QuestionDetail, QuestionType } from "@/api/types.api";
import { AssignPlayersToQuestion } from "@/components/admin/question-form/AssignPlayersToQuestion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { setLoading, useAdminStore } from "@/store/admin.store";

type Props = {
    performanceId: number;
    question?: QuestionDetail;
    handleSubmit: (data: QuestionRequestCreate) => Promise<void>;
};

type QuestionRequestCreate = {
    name: string;
    question: string;
    type: QuestionType;
    index_order: number;
    multiple: boolean;
    players?: Player[];
};
export const QuestionForm = (props: Props) => {
    const { performanceId, handleSubmit, question } = props;
    const [players, setPlayers] = useState<Player[]>([]);
    const loading = useAdminStore((state) => state.loading);
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        getFieldState,
        watch,
        getValues,
        setValue,
    } = useForm<QuestionRequestCreate>();

    useEffect(() => {
        if (getFieldState("index_order").isDirty) {
            return;
        }
        getNewIndexOrder(performanceId).then((index) => setValue("index_order", index));
    }, [getFieldState, performanceId, setValue]);

    const type = watch("type");
    useEffect(() => {
        if (type === "voting") {
            fetchAvailablePlayers(performanceId).then(setPlayers);
        }
    }, [type, performanceId]);

    const handlePlayersChange = (_players: Player[]) => {
        if (type === "voting") {
            setValue("players", _players);
            if (!getFieldState("name").isDirty) {
                setValue("name", _players.map(({ name }) => name).join(", "));
            }
        }
    };

    const onSubmit: SubmitHandler<QuestionRequestCreate> = async (data) => {
        setLoading(true);
        await handleSubmit(data);
        setLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"type"} className={"font-medium"}>
                    Typ otázky
                </Label>
                <ToggleGroup
                    type="single"
                    size={"lg"}
                    defaultValue={getValues("type")}
                    onValueChange={(newValue: QuestionType) => {
                        if (!getFieldState("question").isDirty) {
                            if (newValue === "voting") {
                                setValue("question", "Hlasujte pro hráče");
                            }
                        }
                        setValue("type", newValue as QuestionType);
                    }}
                >
                    <ToggleGroupItem value="text" disabled={true}>
                        <TextIcon className={"mr-2"} />
                        Textová&nbsp;otázka
                    </ToggleGroupItem>
                    <ToggleGroupItem value="voting">
                        <HandIcon className={"mr-2"} />
                        Hlasování
                    </ToggleGroupItem>
                    <ToggleGroupItem value="match" disabled={true}>
                        <NotebookPenIcon className={"mr-2"} />
                        Přiřazování
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"name"} className={"font-medium"}>
                    Název otázky (interní)
                </Label>
                <Input
                    autoFocus={true}
                    placeholder={"Diváci to neuvidí"}
                    id={"name"}
                    {...register("name", { required: true })}
                />
            </div>
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"question"} className={"font-medium"}>
                    Znění otázky pro diváky
                </Label>
                <Textarea id={"question"} {...register("question", { required: true })} />
            </div>
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"index_order"} className={"font-medium"}>
                    Pořadí
                </Label>
                <Input id={"index_order"} type={"number"} {...register("index_order", { required: true })} />
            </div>
            <AssignPlayersToQuestion players={players} handlePlayersChange={handlePlayersChange} />

            <Button variant={"default"} type={"submit"} disabled={loading}>
                Přidat
            </Button>
        </form>
    );
};
