import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { STEPS, getStepIndex } from "@/lib/steps";
import { TutorialLayout } from "@/components/TutorialLayout";
import { StepNav } from "@/components/StepNav";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

function getMdxContent(slug: string) {
  const filePath = path.join(process.cwd(), "content", "steps", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

export async function generateStaticParams() {
  return STEPS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsed = getMdxContent(params.slug);
  if (!parsed) return {};
  const { title, description } = parsed.data;
  return {
    title: `${title} — learn.biohack.tools`,
    description,
  };
}

export default function StepPage({ params }: PageProps) {
  const parsed = getMdxContent(params.slug);
  if (!parsed) notFound();

  const { content, data } = parsed;
  const stepMeta = STEPS[getStepIndex(params.slug)];

  return (
    <TutorialLayout>
      {/* Step header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-sm font-bold">
            {stepMeta.step}
          </span>
          {data.estimatedReadTime && (
            <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
              {data.estimatedReadTime} min read
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight mb-3">
          {data.title}
        </h1>
        {data.description && (
          <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
            {data.description}
          </p>
        )}
        {data.prerequisites && data.prerequisites.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider self-center">
              Prerequisites:
            </span>
            {(data.prerequisites as string[]).map((p) => (
              <span
                key={p}
                className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <hr className="mt-8 border-[hsl(var(--border))]" />
      </div>

      {/* MDX content */}
      <div className="prose">
        <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      {/* Step navigation */}
      <StepNav slug={params.slug} />
    </TutorialLayout>
  );
}
