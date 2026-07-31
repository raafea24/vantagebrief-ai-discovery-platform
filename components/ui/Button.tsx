import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-ink bg-ink text-surface enabled:hover:bg-ink/90 enabled:hover:shadow-[0_7px_18px_rgb(23_32_51_/_0.14)]",
  secondary: "border-border bg-surface text-ink enabled:hover:border-brass enabled:hover:bg-canvas",
};

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 motion-reduce:transform-none ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
