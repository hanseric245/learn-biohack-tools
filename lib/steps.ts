export interface StepMeta {
  slug: string;
  step: string;
  title: string;
}

export const STEPS: StepMeta[] = [
  { slug: "0", step: "0", title: "Decide Which Peptides" },
  { slug: "1", step: "1", title: "Procure Peptides and Supplies" },
  { slug: "1a", step: "1A", title: "Storage" },
  { slug: "2", step: "2", title: "Decide on Dose" },
  { slug: "3", step: "3", title: "Reconstitute" },
  { slug: "4", step: "4", title: "Draw Into Needle" },
  { slug: "5", step: "5", title: "Inject" },
  { slug: "6", step: "6", title: "Dispose Safely" },
];

export function getStepIndex(slug: string): number {
  return STEPS.findIndex((s) => s.slug === slug);
}

export function getPrevStep(slug: string): StepMeta | null {
  const idx = getStepIndex(slug);
  return idx > 0 ? STEPS[idx - 1] : null;
}

export function getNextStep(slug: string): StepMeta | null {
  const idx = getStepIndex(slug);
  return idx < STEPS.length - 1 ? STEPS[idx + 1] : null;
}
