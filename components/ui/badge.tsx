import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500/20 text-green-400 border-green-500/30",
        warning: "border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        info: "border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30",
        violet: "border-transparent bg-violet-500/20 text-violet-400 border-violet-500/30",
        fuchsia: "border-transparent bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
        cyan: "border-transparent bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        emerald: "border-transparent bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
