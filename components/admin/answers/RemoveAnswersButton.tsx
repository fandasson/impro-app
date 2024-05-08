import { removeTextAnswers as removeAnswersRemote } from "@/api/answers.api";
import { Button } from "@/components/ui/Button";
import { removeAnswers as removeAnswersLocal, setLoading, useAdminStore } from "@/store/admin.store";

type Props = {
    answersIds: number[];
    callback?: () => void;
};
export const RemoveAnswersButton = ({ answersIds, callback }: Props) => {
    const loading = useAdminStore((state) => state.loading);
    if (answersIds.length === 0) {
        return null;
    }

    const trigger = async () => {
        setLoading(true);
        removeAnswersLocal(answersIds);
        await removeAnswersRemote(answersIds).finally(() => setLoading(false));
        callback?.();
    };

    const length = answersIds.length;
    const title = `Zahodit ${length} ${length === 1 ? "odpověď" : length < 5 ? "odpovědi" : "odpovědí"}`;
    return (
        <Button variant={"destructive"} onClick={trigger} disabled={loading}>
            {loading ? "Zahazuji blbosti" : title}
        </Button>
    );
};
