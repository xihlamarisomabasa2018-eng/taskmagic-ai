import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Disclaimer } from "@/components/ai-output";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Overview — AuraFlow AI Workplace Assistant" },
      {
        name: "description",
        content:
          "AuraFlow is an AI workplace productivity assistant: draft emails, summarise meetings, plan tasks and research topics from one clean dashboard.",
      },
      { property: "og:title", content: "AuraFlow — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, prioritise tasks and run research briefs with structured AI prompts.",
      },
    ],
  }),
  component: Dashboard,
});

const SCHEDULE = [
  {
    task: "Review marketing assets",
    meta: "High priority • 10:00 AM",
    accent: true,
  },
  {
    task: "Follow up with legal",
    meta: "Medium priority • 2:30 PM",
    accent: false,
  },
];

const TAKEAWAYS = [
  "Launch date for AuraFlow v2.0 is finalized for October 12th. Resources shifting to QA.",
  "Mobile responsiveness remains the top technical debt item to address this sprint.",
  "Marketing requested 3 distinct personas for the email drip campaign.",
];

const ACTIONS = [
  { label: "Update Figma prototypes", owner: "@Marcus" },
  { label: "Draft Q4 hiring plan", owner: "@Sarah" },
  { label: "Submit cloud budget report", owner: "@Elena" },
];

function Dashboard() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Direct");

  return (
    <AppShell
      title="Daily Overview"
      action={
        <Link
          to="/task-planner"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          New Task
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Email Generator</h2>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Feature
            </span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Context
              </label>
              <input
                value={context}
                onChange={(event) => setContext(event.target.value)}
                placeholder="Quarterly budget review..."
                className="w-full border-b border-border bg-transparent py-1 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              {["Professional", "Direct", "Friendly"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTone(option)}
                  className={
                    option === tone
                      ? "rounded bg-primary/5 px-2 py-1 text-[10px] font-semibold text-primary"
                      : "rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/email"
            search={{ context: context || undefined, tone }}
            className="mt-2 w-full rounded-lg border border-primary py-2 text-center text-xs font-bold text-primary transition-colors hover:bg-primary/5"
          >
            Draft Response
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Smart Schedule</h2>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Today
            </span>
          </div>
          <div className="space-y-4">
            {SCHEDULE.map((item) => (
              <div
                key={item.task}
                className={
                  item.accent
                    ? "flex items-start gap-3 rounded-lg bg-secondary p-2"
                    : "flex items-start gap-3 rounded-lg border border-border-subtle p-2"
                }
              >
                <div
                  className={
                    item.accent
                      ? "mt-0.5 size-4 rounded border border-primary/50 bg-primary/10"
                      : "mt-0.5 size-4 rounded border border-border"
                  }
                />
                <div className="flex-1">
                  <p className={item.accent ? "text-xs font-bold" : "text-xs font-semibold"}>
                    {item.task}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/task-planner"
            className="mt-auto text-[10px] font-bold tracking-widest text-primary uppercase"
          >
            Open planner
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Quick Research</h2>
            <div className="size-2 animate-pulse rounded-full bg-primary" />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-2 h-2 w-3/4 rounded-full bg-secondary" />
            <div className="mb-2 h-2 w-full rounded-full bg-secondary" />
            <div className="h-2 w-1/2 rounded-full bg-secondary" />
            <p className="mt-4 text-center text-[10px] font-medium italic text-muted-foreground">
              Analyzing recent market shifts...
            </p>
          </div>
          <Link
            to="/research"
            className="text-[10px] font-bold tracking-widest text-primary uppercase"
          >
            Run a brief
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-secondary/40 px-6 py-4">
          <h3 className="text-sm font-bold">Recent Meeting: Product Roadmap Sync</h3>
          <span className="text-xs font-medium text-muted-foreground">Summarized 2m ago</span>
        </div>
        <div className="grid gap-12 p-6 sm:p-8 md:grid-cols-2">
          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest text-primary uppercase">
              Key Takeaways
            </h4>
            <ul className="space-y-4">
              {TAKEAWAYS.map((takeaway, index) => (
                <li key={takeaway} className="flex gap-3">
                  <span className="text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-sm leading-relaxed text-secondary-foreground">
                    {takeaway}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border-subtle bg-secondary/50 p-6">
            <h4 className="mb-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              Action Items
            </h4>
            <div className="space-y-3">
              {ACTIONS.map((action) => (
                <div key={action.label} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-muted-foreground">{action.owner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-secondary/20 px-6 py-3">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}
