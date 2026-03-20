import * as React from "react";

import { cn } from "@/utils/styling.utils";

interface Props extends React.InputHTMLAttributes<HTMLDivElement> {}

const UseFormattedContent = React.forwardRef<HTMLDivElement, Props>(({ className, children, ...props }, ref) => {
    return (
        <div
            className={cn("text-lg", className)}
            ref={ref}
            {...props}
            dangerouslySetInnerHTML={{ __html: children || "" }}
        />
    );
});

export { UseFormattedContent };
