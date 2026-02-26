import { SafetyCallout } from "@/components/SafetyCallout";
import { PeptideCalculator } from "@/components/PeptideCalculator";

export const mdxComponents = {
  SafetyCallout,
  PeptideCalculator,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} style={{ maxWidth: "50%", height: "auto" }} />
  ),
};
