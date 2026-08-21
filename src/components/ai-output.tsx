import { Check, Copy, RefreshCw } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center text-[10px] font-medium tracking-tight text-muted-foreground ${className}`}
    >
      AI-generated content may require human review
    </p>
  );
}

export function OutputSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <div className="mb-2 h-2 w-3/4 animate-pulse rounded-full bg-secondary" />
      <div className="mb-2 h-2 w-full animate-pulse rounded-full bg-secondary" />
      <div className="mb-2 h-2 w-5/6 animate-pulse rounded-full bg-secondary" />
      <div className="h-2 w-1/2 animate-pulse rounded-full bg-secondary" />
      <p className="mt-4 text-center text-[10px] font-medium italic text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-secondary-foreground">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-[11px] font-bold tracking-widest text-primary uppercase">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold tracking-wide text-foreground uppercase">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="space-y-2 pl-4">{children}</ul>,
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="marker:text-primary">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          hr: () => <hr className="border-border-subtle" />,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border border-border-subtle">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/60">{children}</thead>,
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border-subtle px-3 py-2 align-top">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function OutputPanel({
  heading,
  status,
  loadingLabel,
  emptyLabel,
  error,
  text,
  onRegenerate,
  extra,
}: {
  heading: string;
  status: "idle" | "loading" | "done" | "error";
  loadingLabel: string;
  emptyLabel: string;
  error?: string | null;
  text?: string | null;
  onRegenerate?: () => void;
  extra?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-secondary/40 px-6 py-4">
        <h3 className="text-sm font-bold">{heading}</h3>
        {text ? (
          <div className="flex gap-2">
            {onRegenerate ? (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-secondary"
              >
                <RefreshCw className="size-3" /> Regenerate
              </button>
            ) : null}
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-card uppercase transition-opacity hover:opacity-90"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : null}
      </div>

      {status === "loading" ? (
        <OutputSkeleton label={loadingLabel} />
      ) : status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-8 py-10">
          <p className="max-w-sm text-center text-sm text-destructive">{error}</p>
        </div>
      ) : text ? (
        <div className="flex-1 px-6 py-6">
          <Markdown>{text}</Markdown>
          {extra}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-8 py-10">
          <p className="max-w-xs text-center text-xs font-medium text-muted-foreground">
            {emptyLabel}
          </p>
        </div>
      )}

      <div className="border-t border-border-subtle bg-secondary/20 px-6 py-3">
        <Disclaimer />
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary";

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            option === value
              ? "rounded bg-primary/10 px-2.5 py-1.5 text-[10px] font-semibold text-primary"
              : "rounded bg-secondary px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-border"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
      ) : null}
      {children}
    </button>
  );
}
