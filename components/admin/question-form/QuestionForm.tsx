"use client";
import { HandIcon, ListIcon, NotebookPenIcon, TextIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { areThereMatchAnswersForQuestion, areThereVotesForQuestion, fetchAnsweredOptionIds } from "@/api/answers.api";
import { fetchAvailablePlayers } from "@/api/performances.api";
import { fetchAvailablePools } from "@/api/question-pools.api";
import { fetchAnsweredCharacterIds, fetchQuestions, getNewIndexOrder } from "@/api/questions.api";
import type {
    CharacterInput,
    OptionInput,
    Player,
    Question,
    QuestionDetail,
    QuestionPool,
    QuestionType,
    QuestionUpsertRequest,
} from "@/api/types.api";
import { AssignPlayersToQuestion } from "@/components/admin/question-form/AssignPlayersToQuestion";
import { ManageCharacters } from "@/components/admin/question-form/ManageCharacters";
import { ManageOptions } from "@/components/admin/question-form/ManageOptions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
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
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [freezeVoting, setFreezeVoting] = useState(false);
    const [freezeMatch, setFreezeMatch] = useState(false);
    const [answeredCharacterIds, setAnsweredCharacterIds] = useState<number[]>([]);
    const [answeredOptionIds, setAnsweredOptionIds] = useState<number[]>([]);
    const loading = useAdminStore((state) => state.loading);
    const nameManuallyEdited = useRef(!!question?.name);

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
            optional: question?.optional || false,
            show_player_motto: question?.show_player_motto || false,
            following_question_id: question?.following_question_id ?? null,
            players: question?.players || [],
            characters: question?.characters?.map(({ id, name, description }) => ({ id, name, description })) || [],
            options: question?.options?.map(({ id, option }) => ({ id, option: option ?? "" })) || [],
        },
    });

    useEffect(() => {
        if (!question) {
            return;
        }
        if (question.type === "voting") {
            areThereVotesForQuestion(question.id).then((votesExists) => setFreezeVoting(votesExists));
        }
        if (question.type === "match") {
            areThereMatchAnswersForQuestion(question.id).then((hasAnswers) => setFreezeMatch(hasAnswers));
            fetchAnsweredCharacterIds(question.id).then(setAnsweredCharacterIds);
        }
        if (question.type === "options") {
            fetchAnsweredOptionIds(question.id).then(setAnsweredOptionIds);
        }
    }, [question]);

    useEffect(() => {
        if (getFieldState("index_order").isDirty || getValues("index_order") > 1) {
            return;
        }
        getNewIndexOrder(performanceId).then((index) => setValue("index_order", index));
    }, [getFieldState, getValues, performanceId, setValue]);

    useEffect(() => {
        fetchQuestions(performanceId).then(({ data }) => {
            if (data) {
                // Exclude the current question from the list
                setAllQuestions(data.filter((q) => q.id !== question?.id));
            }
        });
    }, [performanceId, question?.id]);

    const type = useWatch({ control, name: "type" });
    const characters = useWatch({ control, name: "characters" });
    const options = useWatch({ control, name: "options" });
    const optionalValue = useWatch({ control, name: "optional" });
    const showPlayerMottoValue = useWatch({ control, name: "show_player_motto" });
    const followingQuestionId = useWatch({ control, name: "following_question_id" });
    useEffect(() => {
        if (type === "voting" || type === "match") {
            setLoading(true);

            const promises: Promise<unknown>[] = [fetchAvailablePlayers(performanceId).then(setPlayers)];
            if (type === "voting") {
                promises.push(fetchAvailablePools(performanceId).then(setPools));
            }
            Promise.all(promises).then(() => setLoading(false));
        }
    }, [type, performanceId]);

    const handlePlayersChange = (_players: Player[]) => {
        setValue("players", _players);
        if (type === "voting" && !nameManuallyEdited.current) {
            setValue("name", _players.map(({ name }) => name).join(", "));
        }
    };

    const handleCharactersChange = (chars: CharacterInput[]) => {
        setValue("characters", chars);
    };

    const handleOptionsChange = (opts: OptionInput[]) => {
        setValue("options", opts);
    };

    const onSubmit: SubmitHandler<QuestionUpsertRequest> = async (data) => {
        setLoading(true);
        await handleSubmit(data);
        setLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            {(freezeVoting || freezeMatch) && !loading && (
                <div className={"mb-2 rounded border p-4 text-center font-bold"}>
                    Na otázku už někdo odpověděl - některé údaje nelze změnit
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
                    <ToggleGroupItem value="options">
                        <ListIcon className={"mr-2"} />
                        Možnosti
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
                    onChange={(e) => {
                        register("name").onChange(e);
                        nameManuallyEdited.current = true;
                    }}
                />
            </div>
            <div className={"flex flex-col gap-4"}>
                <Label htmlFor={"question"} className={"font-medium"}>
                    Znění otázky pro diváky
                </Label>
                <Textarea id={"question"} {...register("question", { required: true })} />
            </div>
            <div className={"grid grid-cols-3 gap-4"}>
                <div className={"flex flex-col gap-4"}>
                    <Label htmlFor={"index_order"} className={"font-medium"}>
                        Pořadí
                    </Label>
                    <Input id={"index_order"} type={"number"} {...register("index_order", { required: true })} />
                </div>
                <div className={"flex flex-col gap-4"}>
                    <Label htmlFor={"following_question"} className={"font-medium"}>
                        Navazující otázka (volitelné)
                    </Label>
                    <Select
                        value={followingQuestionId != null ? String(followingQuestionId) : "none"}
                        onValueChange={(value) =>
                            setValue("following_question_id", value === "none" ? null : parseInt(value))
                        }
                    >
                        <SelectTrigger id={"following_question"} className="w-full">
                            <SelectValue placeholder="Žádná" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Žádná</SelectItem>
                            {allQuestions.map((q) => (
                                <SelectItem key={q.id} value={String(q.id)}>
                                    {q.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className={"flex flex-col gap-4"}>
                    {type === "voting" && (
                        <>
                            <Label htmlFor={"pool"} className={"font-bold"}>
                                Skupina otázek (pro sčítání hlasů)
                            </Label>
                            <Select
                                onValueChange={(value) => setValue("pool_id", parseInt(value))}
                                defaultValue={String(question?.pool_id) ?? undefined}
                            >
                                <SelectTrigger className="w-[180px] border-amber">
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
            <div className={"flex flex-wrap items-center gap-6"}>
                <div className={"flex items-center gap-3"}>
                    <Switch
                        id={"optional"}
                        checked={optionalValue}
                        onCheckedChange={(checked) => setValue("optional", checked)}
                    />
                    <Label htmlFor={"optional"} className={"font-medium"}>
                        Volitelná otázka (lze přeskočit)
                    </Label>
                </div>
                <div className={"flex items-center gap-3"}>
                    <Switch
                        id={"show_player_motto"}
                        checked={showPlayerMottoValue}
                        onCheckedChange={(checked) => setValue("show_player_motto", checked)}
                    />
                    <Label htmlFor={"show_player_motto"} className={"font-medium"}>
                        Zobrazit motto hráče
                    </Label>
                </div>
            </div>
            {(type === "voting" || type === "match") && (
                <AssignPlayersToQuestion
                    players={players}
                    handlePlayersChange={handlePlayersChange}
                    initialSelectedPlayers={question?.players}
                    disabled={type === "voting" ? freezeVoting : freezeMatch}
                />
            )}
            {type === "match" && (
                <ManageCharacters
                    characters={characters ?? []}
                    answeredCharacterIds={answeredCharacterIds}
                    onCharactersChange={handleCharactersChange}
                />
            )}
            {type === "options" && (
                <ManageOptions
                    options={options ?? []}
                    answeredOptionIds={answeredOptionIds}
                    onOptionsChange={handleOptionsChange}
                />
            )}
            <Button variant={"default"} type={"submit"} disabled={loading}>
                {question ? "Uložit" : "Přidat"}
            </Button>
        </form>
    );
};
