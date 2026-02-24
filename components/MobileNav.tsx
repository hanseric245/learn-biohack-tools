"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { STEPS } from "@/lib/steps";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden p-2 -mr-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        aria-label="Toggle navigation"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-14 z-50 bg-[hsl(var(--background))] lg:hidden overflow-y-auto">
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
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                For educational purposes only. Consult a healthcare professional
                before self-administering any substance.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
