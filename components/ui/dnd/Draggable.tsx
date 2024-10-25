import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    id: number;
};
export const Draggable = (props: Props) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef} style={{ touchAction: "none" }} className={"select-none"} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
};
