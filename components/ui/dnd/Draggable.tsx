import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    id: string;
};
export const Draggable = (props: Props) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef} style={{ touchAction: "manipulation" }} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
};
