import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.95)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background)/0.80)]">
      <div className="flex h-14 items-center px-4 sm:px-6 gap-3">
        <MobileNav />
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-mono text-xs font-semibold tracking-widest text-cyan-500 uppercase shrink-0">
            biohack.tools
          </span>
          <span className="text-[hsl(var(--border))] shrink-0 hidden sm:inline">/</span>
          <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate hidden sm:block">
            Peptide Self-Administration Guide
          </span>
        </Link>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
