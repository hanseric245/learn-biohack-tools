import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPrevStep, getNextStep } from "@/lib/steps";

interface StepNavProps {
  slug: string;
}

export function StepNav({ slug }: StepNavProps) {
  const prev = getPrevStep(slug);
  const next = getNextStep(slug);

  return (
    <nav className="mt-16 pt-8 border-t border-[hsl(var(--border))] flex items-stretch justify-between gap-3">
      {prev ? (
        <Button asChild variant="outline" size="lg" className="gap-2 h-auto py-3 text-left max-w-[48%]">
          <Link href={`/step/${prev.slug}`}>
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="min-w-0">
              <span className="block text-xs text-[hsl(var(--muted-foreground))] font-normal">
                Previous
              </span>
              <span className="block truncate">
                Step {prev.step}: {prev.title}
              </span>
            </span>
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="lg" disabled className="gap-2 h-auto py-3 text-left max-w-[48%]">
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span>
            <span className="block text-xs font-normal">Previous</span>
            <span className="block">Start of Guide</span>
          </span>
        </Button>
      )}

      {next ? (
        <Button asChild size="lg" className="gap-2 h-auto py-3 text-right ml-auto max-w-[48%]">
          <Link href={`/step/${next.slug}`}>
            <span className="min-w-0">
              <span className="block text-xs font-normal opacity-80">Next</span>
              <span className="block truncate">
                Step {next.step}: {next.title}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
        </Button>
      ) : (
        <Button size="lg" disabled className="gap-2 h-auto py-3 text-right ml-auto max-w-[48%]">
          <span>
            <span className="block text-xs font-normal opacity-80">Next</span>
            <span className="block">End of Guide</span>
          </span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </Button>
      )}
    </nav>
  );
}
