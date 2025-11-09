import { CheckIcon } from "lucide-react";
import { ForwardedRef, forwardRef, PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    name: string;
    selected?: boolean;
};
 
export const Character = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={"flex gap-1 rounded border px-2 py-1"}>
            {props.name}
            {props.selected && <CheckIcon size={20} />}
        </div>
    );
});
