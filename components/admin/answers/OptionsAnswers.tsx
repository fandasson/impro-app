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

    let maxValue = 0;
    Object.values(countedOptions).forEach((value, index) => {
        if (value > maxValue) {
            maxValue = value;
        }
    });

    console.log(maxValue);
    return (
        <Table>
            <TableBody>
                {options.map((option) => {
                    const isMaxValue = maxValue === countedOptions[option.id] && countedOptions[option.id] > 0;
                    const bgClass = isMaxValue ? "bg-gray-600" : "";
                    return (
                        <TableRow key={option.id}>
                            <TableCell className={bgClass}>{option.option}</TableCell>
                            <TableCell className={bgClass}>{countedOptions[option.id] || 0}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
