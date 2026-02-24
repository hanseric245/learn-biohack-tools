import { cn } from "@/lib/utils";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

type CalloutVariant = "warning" | "info" | "danger";

interface SafetyCalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  { icon: React.ReactNode; classes: string; titleColor: string }
> = {
  warning: {
    icon: <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />,
    classes:
      "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-700/60 dark:text-amber-200",
    titleColor: "text-amber-800 dark:text-amber-300",
  },
  danger: {
    icon: <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />,
    classes:
      "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/30 dark:border-red-700/60 dark:text-red-200",
    titleColor: "text-red-800 dark:text-red-300",
  },
  info: {
    icon: <Info className="w-5 h-5 shrink-0 mt-0.5" />,
    classes:
      "bg-cyan-50 border-cyan-300 text-cyan-900 dark:bg-cyan-950/30 dark:border-cyan-700/50 dark:text-cyan-200",
    titleColor: "text-cyan-800 dark:text-cyan-300",
  },
};

export function SafetyCallout({
  variant = "warning",
  title,
  children,
  className,
}: SafetyCalloutProps) {
  const { icon, classes, titleColor } = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-5 my-6 text-sm leading-relaxed",
        classes,
        className
      )}
    >
      <span className={titleColor}>{icon}</span>
      <div className="flex-1">
        {title && (
          <p className={cn("font-bold text-base mb-1.5", titleColor)}>
            {title}
          </p>
        )}
        <div className="space-y-1 [&_p]:mb-0 [&_p]:leading-relaxed [&_p]:text-[0.95rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
