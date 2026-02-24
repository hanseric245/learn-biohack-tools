import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.95)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background)/0.80)]">
      <div className="flex h-14 items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-3 mr-6">
          <span className="font-mono text-xs font-semibold tracking-widest text-cyan-500 uppercase">
            biohack.tools
          </span>
          <span className="text-[hsl(var(--border))]">/</span>
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Peptide Self-Administration Guide
          </span>
        </Link>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
