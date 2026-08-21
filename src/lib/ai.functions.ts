import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runWorkplacePrompt } from "./ai-gateway.server";
import {
  CHAT_SYSTEM,
  EMAIL_SYSTEM,
  NOTES_SYSTEM,
  PLANNER_SYSTEM,
  RESEARCH_SYSTEM,
} from "./ai-prompts";

const EmailInput = z.object({
  context: z.string().min(3),
  tone: z.string().min(1),
  audience: z.string().min(1),
  length: z.string().min(1),
  keyPoints: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runWorkplacePrompt({
      system: EMAIL_SYSTEM,
      prompt: [
        `Situation / purpose of the email: ${data.context}`,
        `Tone: ${data.tone}`,
        `Audience: ${data.audience}`,
        `Length: ${data.length} (Short = under 90 words, Standard = 100-160 words, Detailed = 200-280 words)`,
        data.keyPoints?.trim()
          ? `Must-include points:\n${data.keyPoints.trim()}`
          : "No extra points supplied; keep strictly to the situation above.",
      ].join("\n"),
    });
    return { text };
  });

const NotesInput = z.object({
  notes: z.string().min(20),
  meetingTitle: z.string().optional(),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runWorkplacePrompt({
      system: NOTES_SYSTEM,
      prompt: [
        `Meeting: ${data.meetingTitle?.trim() || "[confirm title]"}`,
        `Raw notes / transcript:\n${data.notes.trim()}`,
      ].join("\n\n"),
    });
    return { text };
  });

const PlannerInput = z.object({
  tasks: z.string().min(5),
  workingHours: z.string().min(1),
  focus: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runWorkplacePrompt({
      system: PLANNER_SYSTEM,
      prompt: [
        `Working hours available today: ${data.workingHours}`,
        data.focus?.trim() ? `Stated priority for the day: ${data.focus.trim()}` : "",
        `Task list (raw, unordered):\n${data.tasks.trim()}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });
    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().min(3),
  depth: z.string().min(1),
  audience: z.string().optional(),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runWorkplacePrompt({
      system: RESEARCH_SYSTEM,
      prompt: [
        `Research topic or question: ${data.topic}`,
        `Depth: ${data.depth} (Brief = tight overview, Standard = balanced brief, Deep = thorough analysis)`,
        data.audience?.trim() ? `Prepared for: ${data.audience.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const text = await runWorkplacePrompt({
      system: CHAT_SYSTEM,
      prompt: `Conversation so far:\n\n${transcript}\n\nAssistant:`,
    });
    return { text };
  });
