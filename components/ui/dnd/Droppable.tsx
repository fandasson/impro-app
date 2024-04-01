import { useDroppable } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    id: UniqueIdentifier;
};
export const Droppable = (props: Props) => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? "green" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
};
