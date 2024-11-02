import * as React from "react";

import { cn } from "@/utils/styling.utils";

export interface ParagraphProps extends React.InputHTMLAttributes<HTMLParagraphElement> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...props }, ref) => {
    return (
        <p
            className={cn("text-lg", className)}
            ref={ref}
            {...props}
            dangerouslySetInnerHTML={{ __html: children || "" }}
        />
    );
});

export { Paragraph };
