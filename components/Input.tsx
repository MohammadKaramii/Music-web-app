import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          `
        flex 
        w-full 
        rounded-md 
        bg-neutral-700
        border
        border-transparent
        px-3 
        py-3 
        text-sm 
        file:border-0 
        file:bg-transparent 
        file:text-sm 
        file:font-medium 
        placeholder:text-neutral-400 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        focus:outline-none
        focus:ring-0
        focus:ring-transparent
        focus:border-transparent
      `,
          disabled && "opacity-75",
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
