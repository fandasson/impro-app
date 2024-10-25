"use client";
import { QuestionOptions } from "@/api/types.api";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { useOptionsAnswers } from "@/hooks/admin.hooks";
import { countOptions } from "@/utils/answers.utils";

type Props = {
    options: QuestionOptions[];
    questionId: number;
};

export const OptionsAnswers = ({ options, questionId }: Props) => {
    const answers = useOptionsAnswers(questionId);
    const countedOptions = countOptions(options, answers);

    if (options.length === 0) {
        return null;
    }

    return (
        <Table>
            <TableBody>
                {options.map((option) => {
                    return (
                        <TableRow key={option.id}>
                            <TableCell>{option.option}</TableCell>
                            <TableCell>{countedOptions[option.id] || 0}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
