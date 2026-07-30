type StatusTone = "neutral" | "success" | "danger";

export type StatusIndicatorProps = {
  children: React.ReactNode;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-mineral",
  success: "bg-success",
  danger: "bg-danger",
};

export function StatusIndicator({
  children,
  tone = "neutral",
}: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${toneClasses[tone]}`}
      />
      {children}
    </span>
  );
}
