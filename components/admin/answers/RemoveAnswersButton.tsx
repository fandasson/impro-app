import { removeAnswers } from "@/api/answers.api";
import { Button } from "@/components/ui/Button";

type Props = {
    answersIds: number[];
    callback?: () => void;
};
export const RemoveAnswersButton = ({ answersIds, callback }: Props) => {
    if (answersIds.length === 0) {
        return null;
    }

    const trigger = async () => {
        await removeAnswers(answersIds);
        callback?.();
    };

    const length = answersIds.length;
    const title = `Zahodit ${length} ${length === 1 ? "odpověď" : length < 5 ? "odpovědi" : "odpovědí"}`;
    return (
        <Button variant={"destructive"} onClick={trigger}>
            {title}
        </Button>
    );
};
