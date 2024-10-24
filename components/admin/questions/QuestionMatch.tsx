import { QuestionWithPlayersAndCharacters } from "@/api/types.api";

type Props = {
    question: QuestionWithPlayersAndCharacters;
};
export const QuestionMatch = ({ question }: Props) => {
    if (question.type !== "match") {
        return null;
    }
    return (
        <>
            <div>
                <h3 className={"text-lg font-medium"}>Postavy</h3>
                {question.characters?.map((character) => character.name).join(", ")}
            </div>
            <div>
                <h3 className={"text-lg font-medium"}>Improvizátoři</h3>
                {question.players?.map((player) => player.name).join(", ")}
            </div>
        </>
    );
};
