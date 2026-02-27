"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { STEPS } from "@/lib/steps";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] py-8 px-4">
      <p className="px-3 mb-4 text-xs font-bold tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
        Guide Steps
      </p>
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {STEPS.map((s) => {
          const href = `/step/${s.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={s.slug}
              href={href}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                active
                  ? "bg-cyan-500/10 text-cyan-500 font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border transition-colors duration-150",
                  active
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-500"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] group-hover:border-[hsl(var(--foreground)/0.3)]"
                )}
              >
                {s.step}
              </span>
              <span className="leading-snug">{s.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 pt-4 border-t border-[hsl(var(--sidebar-border))]">
        <a
          href="https://forms.gle/ivbStBnAymg4vYDT9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[hsl(var(--muted-foreground))] hover:opacity-100 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-all duration-150"
        >
          <MessageSquare className="w-4 h-4 shrink-0 text-cyan-500 animate-pulse" />
          <span>Feedback</span>
        </a>
        <p className="mt-3 px-3 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
          This guide is for educational purposes only. Always consult a
          qualified healthcare professional before self-administering any
          substance.
        </p>
      </div>
    </aside>
  );
}
