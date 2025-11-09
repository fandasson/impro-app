"use client";
import { HandIcon, NotebookPenIcon, TextIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { areThereVotesForQuestion } from "@/api/answers.api";
import { fetchAvailablePlayers } from "@/api/performances.api";
import { fetchAvailablePools } from "@/api/question-pools.api";
import { getNewIndexOrder } from "@/api/questions.api";
import { Player, QuestionDetail, QuestionPool, QuestionType, QuestionUpsertRequest } from "@/api/types.api";
import { AssignPlayersToQuestion } from "@/components/admin/question-form/AssignPlayersToQuestion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { setLoading, useAdminStore } from "@/store/admin.store";

type Props = {
    performanceId: number;
    question?: QuestionDetail;
    handleSubmit: (data: QuestionUpsertRequest) => Promise<void>;
};

type QuestionRequestCreate = {
    name: string;
    question: string;
    type: QuestionType;
    index_order: number;
    multiple: boolean;
    pool_id?: number;
    players?: Player[];
};
export const QuestionForm = (props: Props) => {
    const { performanceId, handleSubmit, question } = props;
    const [players, setPlayers] = useState<Player[]>([]);
    const [pools, setPools] = useState<QuestionPool[]>([]);
    const [freezeVoting, setFreezeVoting] = useState(false);
    const loading = useAdminStore((state) => state.loading);

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        getFieldState,
        control,
        getValues,
        setValue,
    } = useForm<QuestionUpsertRequest>({
        defaultValues: {
            name: question?.name || "",
            question: question?.question || "",
            type: question?.type || "text",
            index_order: question?.index_order || 1,
            multiple: question?.multiple || false,
            players: question?.players || [],
        },
    });

    useEffect(() => {
        if (!question) {
            return;
        }
        areThereVotesForQuestion(question.id).then((votesExists) => setFreezeVoting(votesExists));
    }, [question]);

    useEffect(() => {
        if (getFieldState("index_order").isDirty || getValues("index_order") > 1) {
            return;
        }
        getNewIndexOrder(performanceId).then((index) => setValue("index_order", index));
    }, [getFieldState, getValues, performanceId, setValue]);

    const type = useWatch({ control, name: "type" });
    useEffect(() => {
        if (type === "voting") {
            setLoading(true);

            const _fetchPlayers = fetchAvailablePlayers(performanceId).then(setPlayers);
            const _fetchPools = fetchAvailablePools(performanceId).then(setPools);
            Promise.all([_fetchPlayers, _fetchPools]).then(() => setLoading(false));
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

    const onSubmit: SubmitHandler<QuestionUpsertRequest> = async (data) => {
        setLoading(true);
        await handleSubmit(data);
        setLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            {freezeVoting && !loading && (
                <div className={"mb-2 rounded border p-4 text-center font-bold"}>
                    Na otázku se už hlasovalo - některé údaje nelze změnit
                </div>
            )}
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"type"} className={"font-medium"}>
                    Typ otázky
                </Label>
                <ToggleGroup
                    type="single"
                    size={"lg"}
                    disabled={!!question}
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
                    <ToggleGroupItem value="text">
                        <TextIcon className={"mr-2"} />
                        Textová&nbsp;otázka
                    </ToggleGroupItem>
                    <ToggleGroupItem value="voting">
                        <HandIcon className={"mr-2"} />
                        Hlasování
                    </ToggleGroupItem>
                    <ToggleGroupItem value="match">
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
            <div className={"grid grid-cols-2 gap-4"}>
                <div className={"flex flex-col gap-4"}>
                    <Label htmlFor={"index_order"} className={"font-medium"}>
                        Pořadí
                    </Label>
                    <Input id={"index_order"} type={"number"} {...register("index_order", { required: true })} />
                </div>
                <div className={"flex flex-col gap-4"}>
                    {type === "voting" && (
                        <>
                            <Label htmlFor={"pool"} className={"font-medium"}>
                                Skupina otázek (pro sčítání hlasů)
                            </Label>
                            <Select
                                onValueChange={(value) => setValue("pool_id", parseInt(value))}
                                defaultValue={String(question?.pool_id) ?? undefined}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Vyberte skupinu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pools.map((pool) => (
                                        <SelectItem key={pool.id} value={String(pool.id)}>
                                            {pool.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </div>
            </div>
            {type === "voting" && (
                <AssignPlayersToQuestion
                    players={players}
                    handlePlayersChange={handlePlayersChange}
                    initialSelectedPlayers={question?.players}
                    disabled={freezeVoting}
                />
            )}
            <Button variant={"default"} type={"submit"} disabled={loading}>
                {question ? "Uložit" : "Přidat"}
            </Button>
        </form>
    );
};
