import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`min-h-11 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-ink shadow-[var(--shadow-subtle)] transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-ink-muted/70 enabled:hover:border-mineral focus-visible:border-focus disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
