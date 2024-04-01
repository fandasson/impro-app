import { ForwardedRef, forwardRef, PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    name: string;
};
// eslint-disable-next-line react/display-name
export const Character = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={"rounded border px-2 py-1"}>
            {props.name}
        </div>
    );
});
