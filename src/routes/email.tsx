import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  ChipGroup,
  Field,
  OutputPanel,
  PrimaryButton,
  inputClass,
} from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { generateEmail } from "@/lib/ai.functions";
import { AUDIENCES, LENGTHS, TONES } from "@/lib/ai-prompts";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AuraFlow" },
      {
        name: "description",
        content:
          "Generate professional workplace emails tuned to a specific tone, audience and length with structured AI prompting.",
      },
      { property: "og:title", content: "Smart Email Generator — AuraFlow" },
      {
        property: "og:description",
        content: "Tone- and audience-aware AI email drafting for professionals.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Standard");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (context.trim().length < 3) {
      setStatus("error");
      setError("Describe the situation or purpose of the email first.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const result = await run({
        data: { context, tone, audience, length, keyPoints },
      });
      setText(result.text);
      setStatus("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed. Try again.");
      setStatus("error");
    }
  };

  return (
    <AppShell title="Smart Email Generator">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="font-bold">Draft parameters</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tone and audience shape structure, formality and the closing ask.
            </p>
          </div>

          <Field label="Context">
            <textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={4}
              placeholder="Tell the client the quarterly budget review slips by one week and propose new dates."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Tone">
            <ChipGroup options={TONES} value={tone} onChange={setTone} />
          </Field>

          <Field label="Audience">
            <select
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              className={inputClass}
            >
              {AUDIENCES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Length">
            <ChipGroup options={LENGTHS} value={length} onChange={setLength} />
          </Field>

          <Field label="Must-include points (optional)">
            <textarea
              value={keyPoints}
              onChange={(event) => setKeyPoints(event.target.value)}
              rows={3}
              placeholder="New review date: Oct 12. Finance sign-off still pending."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <PrimaryButton onClick={submit} loading={status === "loading"}>
            {status === "loading" ? "Drafting..." : "Generate Draft"}
          </PrimaryButton>
        </div>

        <OutputPanel
          heading="Email draft"
          status={status}
          error={error}
          text={text}
          loadingLabel="Composing a draft in the selected tone..."
          emptyLabel="Set your context, tone and audience, then generate a draft. It will appear here ready to copy."
          onRegenerate={submit}
        />
      </div>
    </AppShell>
  );
}
