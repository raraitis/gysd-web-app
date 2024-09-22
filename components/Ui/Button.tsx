import { clsxm } from "../../utils/clsxm";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        primary:
          "flex w-full cursor-pointer items-center justify-center border border-primary bg-primary text-white transition hover:bg-opacity-90",
        destructive:
          "flex w-full items-center justify-center bg-red-600 text-white transition hover:bg-red-400",
        outline:
          "flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray hover:bg-zinc-100 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-zinc-50",
        subtle: "hover:bg-zinc-200 bg-zinc-100 gap-3.5 text-zinc-600",
        ghost:
          "bg-transparent hover:bg-zinc-100 text-zinc-800 data-[state=open]:bg-transparent data-[state=open]:bg-transparent",
        // link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "my-5 rounded-lg p-4",
        sm: "h-9 px-2 rounded-md",
        xs: "h-8 px-1.5 rounded-sm",
        lg: "h-11 px-8 p-4 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={clsxm(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <LoadingIndicatorSmall /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
