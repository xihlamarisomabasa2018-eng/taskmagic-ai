import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import avatar from "@/assets/avatar-sarah.jpg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Smart Email" },
  { to: "/meeting-notes", label: "Meeting Notes" },
  { to: "/task-planner", label: "Task Planner" },
  { to: "/research", label: "Research" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          activeProps={{ className: "bg-primary/10 text-primary hover:bg-primary/10" }}
        >
          {({ isActive }) => (
            <>
              <span
                className={`size-2 rounded-full ${isActive ? "bg-primary" : "bg-border"}`}
              />
              {item.label}
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-8 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">
        A
      </div>
      <span className="text-lg font-bold tracking-tight">AuraFlow</span>
    </div>
  );
}

function UserCard() {
  return (
    <div className="mt-auto border-t border-border-subtle p-4">
      <div className="flex items-center gap-3 px-2">
        <img
          src={avatar}
          alt="Sarah Jenkins"
          width={512}
          height={512}
          loading="lazy"
          className="size-10 rounded-full object-cover outline-1 -outline-offset-1 outline-black/5"
        />
        <div>
          <p className="text-sm font-semibold">Sarah Jenkins</p>
          <p className="text-xs text-muted-foreground">Pro Account</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="p-6">
          <Brand />
        </div>
        <NavList />
        <UserCard />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open navigation"
                className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground lg:hidden"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="p-6">
                    <Brand />
                  </div>
                  <NavList onNavigate={() => setOpen(false)} />
                  <UserCard />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
              <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-success" />
              AI System Ready
            </div>
            {action}
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-8">{children}</div>
      </main>

      {pathname !== "/chat" ? (
        <Link
          to="/chat"
          aria-label="Open AI chat"
          className="fixed right-6 bottom-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-110 active:scale-95 sm:right-8 sm:bottom-8"
        >
          <span className="flex flex-col items-center gap-0.5">
            <span className="h-1 w-5 rounded-full bg-current" />
            <span className="h-1 w-5 rounded-full bg-current" />
            <span className="mr-auto h-1 w-3 rounded-full bg-current" />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
