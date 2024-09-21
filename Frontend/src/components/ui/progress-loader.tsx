import { HtmlHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ProgressLoaderProps = HtmlHTMLAttributes<HTMLDivElement> & {
  dir?: "from" | "to";
};

export const ProgressLoader = ({
  className,
  dir = "from",
  ...props
}: ProgressLoaderProps) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="h-2 w-full bg-foreground/10 overflow-hidden rounded">
        <div
          className={cn(
            "w-full h-full bg-foreground origin-left-right",
            dir === "from" ? "animate-progress" : "animate-progress-reverse"
          )}
        ></div>
      </div>
    </div>
  );
};
