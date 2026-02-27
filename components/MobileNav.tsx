"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { STEPS } from "@/lib/steps";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const overlay = open && (
    <div className="fixed left-0 right-0 top-14 bottom-0 z-50 bg-[hsl(var(--background))] overflow-y-auto lg:hidden">
      <div className="p-6">
        <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-4">
          Guide Steps
        </p>
        <nav className="flex flex-col gap-1">
          {STEPS.map((s) => {
            const href = `/step/${s.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={s.slug}
                href={href}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-3 py-3 text-base transition-colors",
                  active
                    ? "bg-cyan-500/10 text-cyan-500 font-semibold"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border",
                    active
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-500"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {s.step}
                </span>
                <span>{s.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-[hsl(var(--border))]">
          <a
            href="https://forms.gle/ivbStBnAymg4vYDT9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-base text-[hsl(var(--muted-foreground))] hover:opacity-100 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-all"
          >
            <MessageSquare className="w-5 h-5 shrink-0 text-cyan-500 animate-pulse" />
            <span>Feedback</span>
          </a>
          <p className="mt-4 px-3 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            For educational purposes only. Consult a healthcare professional
            before self-administering any substance.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden p-2 -mr-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        aria-label="Toggle navigation"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
