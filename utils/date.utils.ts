import { format } from "date-fns";

export const formatDate = (date: string): string => format(new Date(date), "dd. MM. yyyy");
