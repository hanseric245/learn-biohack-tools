"use client";

import { useState, useMemo, useRef } from "react";

const PEPTIDES = [
  "5-amino-1MQ",
  "AOD-9604",
  "B7-33",
  "BPC-157",
  "Bronchogen",
  "Cardiogen",
  "Cartalax",
  "Cerebrolysin",
  "Chonluten",
  "CJC-1295 / Ipamorelin",
  "Cortagen",
  "Crystagen",
  "Epitalon",
  "FOX04-DRI",
  "GHK-Cu",
  "Glutathione",
  "HGH",
  "Humanin",
  "IGF-1 LR3",
  "KPV",
  "Livagen",
  "LL-37",
  "Melanotan 2 (MT2)",
  "MOTS-c",
  "NAD+",
  "Ovagen",
  "Oxytocin",
  "P21",
  "Pancragen",
  "Pinealon",
  "Prostamax",
  "PT-141",
  "Retatrutide",
  "Selank",
  "Semaglutide",
  "Semax",
  "SLU-PP-332",
  "SS-31",
  "TB-500",
  "Teriparatide",
  "Tesamorelin",
  "Testagen",
  "Thymalin",
  "Thymosin Alpha-1",
  "Tirzepatide",
  "Vesugen",
  "Vilon",
];

const FREQUENCIES: { label: string; dosesPerWeek: number }[] = [
  { label: "Once daily", dosesPerWeek: 7 },
  { label: "Twice daily", dosesPerWeek: 14 },
  { label: "Every other day (EOD)", dosesPerWeek: 3.5 },
  { label: "3× per week", dosesPerWeek: 3 },
  { label: "Twice weekly", dosesPerWeek: 2 },
  { label: "Once weekly", dosesPerWeek: 1 },
  { label: "Twice monthly", dosesPerWeek: 0.5 },
  { label: "Once monthly", dosesPerWeek: 0.25 },
];

const SYRINGE_UNITS: Record<string, number> = {
  "U-100": 100,
  "U-50": 50,
  "U-40": 40,
};

type DoseUnit = "mcg" | "mg";
type SyringeType = "U-100" | "U-50" | "U-40";

interface Results {
  bwUsed: number;
  bwOverridden: boolean;
  concentration: number;
  volumeMl: number;
  syringeUnits: number;
  totalDoses: number;
  supplyLabel: string | null;
  frequencyLabel: string | null;
  reconstitution: string;
  drawInstruction: string;
  summary: string;
}

function computeRecommended(
  vialMg: number,
  doseMg: number,
  syringe: SyringeType,
  dosesPerWeek: number | null,
  bwOverride: number | null
): Results | null {
  if (!vialMg || !doseMg || vialMg <= 0 || doseMg <= 0 || doseMg > vialMg) return null;

  const unitsPerMl = SYRINGE_UNITS[syringe];

  let bwUsed: number;
  let bwOverridden = false;

  if (bwOverride && bwOverride > 0) {
    bwUsed = bwOverride;
    bwOverridden = true;
  } else {
    const BW_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
    let bestBW = 2;
    let bestScore = Infinity;
    for (const bw of BW_OPTIONS) {
      const concentration = vialMg / bw;
      const volumeMl = doseMg / concentration;
      const units = volumeMl * unitsPerMl;
      if (units < 2 || units > 100) continue;
      const score = Math.abs(units - Math.round(units / 5) * 5);
      if (score < bestScore) {
        bestScore = score;
        bestBW = bw;
      }
    }
    bwUsed = bestBW;
  }

  const concentration = vialMg / bwUsed;
  const volumeMl = doseMg / concentration;
  const syringeUnits = volumeMl * unitsPerMl;
  const totalDoses = vialMg / doseMg;

  let supplyLabel: string | null = null;
  let frequencyLabel: string | null = null;
  if (dosesPerWeek) {
    const match = FREQUENCIES.find((f) => f.dosesPerWeek === dosesPerWeek);
    frequencyLabel = match?.label ?? null;
    const totalDays = (totalDoses / dosesPerWeek) * 7;
    if (totalDays < 14) supplyLabel = `${Math.round(totalDays)} days`;
    else if (totalDays < 60) supplyLabel = `${Math.round(totalDays / 7)} weeks`;
    else supplyLabel = `~${(totalDays / 30).toFixed(1)} months`;
  }

  const unitsDisplay =
    syringeUnits % 1 === 0 ? syringeUnits.toFixed(0) : syringeUnits.toFixed(1);

  const reconstitution = bwOverridden
    ? `Your vial was reconstituted with ${bwUsed}ml of bacteriostatic water.`
    : `Add ${bwUsed}ml of bacteriostatic water to the vial to dissolve the peptide. Do this once when you first open the vial.`;
  const drawInstruction = `Draw to the ${unitsDisplay} unit mark on your ${syringe} syringe each time you dose.`;
  const summary = `${reconstitution} ${drawInstruction}`;

  return {
    bwUsed,
    bwOverridden,
    concentration,
    volumeMl,
    syringeUnits,
    totalDoses,
    supplyLabel,
    frequencyLabel,
    reconstitution,
    drawInstruction,
    summary,
  };
}

function PeptideCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return PEPTIDES;
    return PEPTIDES.filter((p) =>
      p.toLowerCase().includes(value.toLowerCase())
    );
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="e.g. BPC-157 — or type any name"
        className="
          w-full bg-[#081322] border border-[#1a3050] rounded-xl
          px-5 py-4 text-slate-100 text-xl
          placeholder:text-slate-600
          focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
          transition-colors duration-150
        "
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a1628] border border-[#1e3a5f] rounded-xl overflow-hidden z-50 shadow-2xl max-h-64 overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p}
              onMouseDown={() => { onChange(p); setOpen(false); }}
              className="w-full text-left px-5 py-3 text-lg text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors duration-100 border-b border-[#1a3050] last:border-0"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-sm font-semibold tracking-widest text-slate-300 uppercase">
          {label}
        </span>
        {hint && (
          <p className="mt-0.5 text-sm text-slate-500 leading-snug">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function NumericInput({
  label,
  hint,
  value,
  onChange,
  unit,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          min="0"
          step="any"
          className="
            w-full bg-[#081322] border border-[#1a3050] rounded-xl
            px-5 py-4 text-slate-100 text-xl font-mono
            placeholder:text-slate-600
            focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
            transition-colors duration-150
          "
          style={{ paddingRight: unit ? "3.5rem" : undefined }}
        />
        {unit && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base text-slate-500 font-mono pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </Field>
  );
}

function ResultCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 bg-[#081322] border border-[#1a3050] rounded-xl px-4 py-3">
      <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
        {label}
      </span>
      <span className="text-lg font-mono font-medium text-slate-400 tracking-tight">
        {value}
      </span>
      {sub && <span className="text-xs text-slate-600">{sub}</span>}
    </div>
  );
}

export function PeptideCalculator() {
  const [calcName, setCalcName] = useState("");
  const [vialMg, setVialMg] = useState("");
  const [dose, setDose] = useState("");
  const [doseUnit, setDoseUnit] = useState<DoseUnit>("mg");
  const [frequency, setFrequency] = useState("");
  const [syringe, setSyringe] = useState<SyringeType>("U-100");
  const [bwOverride, setBwOverride] = useState("");

  const doseMg = useMemo(
    () => (doseUnit === "mcg" ? parseFloat(dose) / 1000 : parseFloat(dose)),
    [dose, doseUnit]
  );

  const selectedFreq = useMemo(
    () => FREQUENCIES.find((f) => String(f.dosesPerWeek) === frequency) ?? null,
    [frequency]
  );

  const results = useMemo(
    () =>
      computeRecommended(
        parseFloat(vialMg),
        doseMg,
        syringe,
        selectedFreq?.dosesPerWeek ?? null,
        parseFloat(bwOverride) || null
      ),
    [vialMg, doseMg, syringe, selectedFreq, bwOverride]
  );

  const hasResults = results !== null;

  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* ── Screen UI ── */}
      <div className="print:hidden">
        <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl">
            {/* Inputs */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-cyan-400 rounded-full" />
                  <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
                    Inputs
                  </h2>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => {
                      setCalcName("");
                      setVialMg("");
                      setDose("");
                      setDoseUnit("mg");
                      setFrequency("");
                      setSyringe("U-100");
                      setBwOverride("");
                    }}
                    className="text-slate-600 hover:text-slate-300 transition-colors duration-150 p-1"
                    aria-label="Start over"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-[#070f20] border border-[#1e3a5f] rounded text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                    Start over
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Peptide name */}
                <Field
                  label="Peptide Name"
                  hint="Start typing to search, or enter any custom name."
                >
                  <PeptideCombobox value={calcName} onChange={setCalcName} />
                </Field>

                {/* Vial amount */}
                <NumericInput
                  label="Vial Peptide Amount"
                  hint="mg = milligrams — the total amount printed on your vial label (e.g. 5mg, 10mg)."
                  value={vialMg}
                  onChange={setVialMg}
                  unit="mg"
                  placeholder="Example: 10"
                />

                {/* Prescribed dose */}
                <Field
                  label="Prescribed Dose"
                  hint="mcg = micrograms, mg = milligrams. 1mg = 1,000mcg. Most peptide doses are in mcg."
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex bg-[#081322] border border-[#1a3050] rounded-xl overflow-hidden self-start">
                      {(["mcg", "mg"] as DoseUnit[]).map((u) => (
                        <button
                          key={u}
                          onClick={() => setDoseUnit(u)}
                          className={`
                            px-5 py-2.5 text-base font-mono font-medium transition-colors duration-150
                            ${doseUnit === u
                              ? "bg-cyan-400/10 text-cyan-400"
                              : "text-slate-500 hover:text-slate-300"
                            }
                          `}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder="Example: 250. Enter your amount here."
                      min="0"
                      step="any"
                      className="
                        w-full bg-[#081322] border border-[#1a3050] rounded-xl
                        px-5 py-4 text-slate-100 text-xl font-mono
                        placeholder:text-slate-600
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
                        transition-colors duration-150
                      "
                    />
                  </div>
                </Field>

                {/* Frequency */}
                <Field
                  label="Dose Frequency"
                  hint="Optional. Used to calculate how long your vial will last."
                >
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="
                      w-full bg-[#081322] border border-[#1a3050] rounded-xl
                      px-5 py-4 text-xl cursor-pointer
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
                      transition-colors duration-150
                    "
                    style={{ color: frequency ? "#e2e8f0" : "#475569" }}
                  >
                    <option value="">Select frequency (optional)</option>
                    {FREQUENCIES.map((f) => (
                      <option key={f.dosesPerWeek} value={String(f.dosesPerWeek)}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Syringe type */}
                <Field
                  label="Syringe Type"
                  hint="U-100 is the standard insulin syringe — 100 units per ml. Most peptide users use U-100."
                >
                  <select
                    value={syringe}
                    onChange={(e) => setSyringe(e.target.value as SyringeType)}
                    className="
                      w-full bg-[#081322] border border-[#1a3050] rounded-xl
                      px-5 py-4 text-slate-100 text-xl
                      focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
                      transition-colors duration-150 cursor-pointer
                    "
                  >
                    <option value="U-100">U-100 (100 units / ml)</option>
                    <option value="U-50">U-50 (50 units / ml)</option>
                    <option value="U-40">U-40 (40 units / ml)</option>
                  </select>
                </Field>

                {/* BW override */}
                <NumericInput
                  label="Bacteriostatic Water Used (optional)"
                  hint="Already reconstituted your vial, or given a specific amount to use? Enter it here and we'll calculate your draw from that instead."
                  value={bwOverride}
                  onChange={setBwOverride}
                  unit="ml"
                  placeholder="Leave blank to use our recommendation"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1a3050]" />

            {/* Results */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-7">
                <div className={`w-1 h-5 rounded-full transition-colors duration-300 ${hasResults ? "bg-cyan-400" : "bg-slate-600"}`} />
                <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
                  Results
                </h2>
              </div>

              {!hasResults ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-[#1a3050] flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-base">Fill in vial amount and dose to calculate</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Primary callout — two steps */}
                  <div className="bg-cyan-400/10 border border-cyan-400/40 rounded-xl px-6 py-5 flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-xs font-bold">1</span>
                      <div>
                        <p className="text-xs font-semibold tracking-widest text-cyan-400/70 uppercase mb-1">Reconstitution — once per vial</p>
                        <p className="text-cyan-100 text-xl leading-snug font-bold">{results.reconstitution}</p>
                      </div>
                    </div>
                    <div className="border-t border-cyan-400/20" />
                    <div className="flex gap-3 items-start">
                      <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-xs font-bold">2</span>
                      <div>
                        <p className="text-xs font-semibold tracking-widest text-cyan-400/70 uppercase mb-1">Dosing — each time you inject</p>
                        <p className="text-cyan-100 text-xl leading-snug font-bold">{results.drawInstruction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Supporting cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <ResultCard
                      label={results.bwOverridden ? "BW Used" : "Add BW"}
                      value={`${results.bwUsed} ml`}
                      sub={results.bwOverridden ? "your amount" : "recommended"}
                    />
                    <ResultCard
                      label="Doses / Vial"
                      value={Number.isInteger(results.totalDoses)
                        ? String(results.totalDoses)
                        : results.totalDoses.toFixed(1)}
                    />
                    <ResultCard
                      label="Supply"
                      value={results.supplyLabel ?? "—"}
                      sub={results.frequencyLabel ?? "add frequency"}
                    />
                    <ResultCard
                      label="Concentration"
                      value={`${results.concentration.toFixed(2)} mg/ml`}
                    />
                  </div>

                  {/* Print button */}
                  <button
                    onClick={() => {
                      const peptidePart = calcName
                        ? calcName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "")
                        : "peptide";
                      const dosePart = dose ? `${dose}${doseUnit}` : "dose";
                      const filename = `${peptidePart}_${dosePart}_dose`;
                      const prev = document.title;
                      document.title = filename;
                      window.print();
                      document.title = prev;
                    }}
                    className="
                      mt-2 w-full flex items-center justify-center gap-2
                      border border-slate-600 hover:border-cyan-400 hover:text-cyan-400
                      text-slate-400 text-base font-medium rounded-xl px-5 py-3.5
                      transition-colors duration-150
                    "
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / Save as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* ── Print card ── */}
      {hasResults && (
        <div className="hidden print:block p-10 font-sans text-black">
          <div className="border-2 border-black rounded-xl p-8 max-w-lg mx-auto">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-300">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">biohack.tools</p>
                <p className="text-xs text-gray-400">Peptide Dosage Calculator</p>
              </div>
              <p className="text-xs text-gray-400">{printDate}</p>
            </div>

            <h1 className="text-3xl font-bold text-black mb-6">
              {calcName || "Peptide Dosage Reference"}
            </h1>

            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Inputs</p>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Vial Peptide Amount", `${vialMg} mg`],
                    ["Prescribed Dose", `${dose} ${doseUnit}`],
                    ...(selectedFreq ? [["Frequency", selectedFreq.label]] : []),
                    ["Syringe Type", syringe],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">{label}</td>
                      <td className="py-2 font-mono font-semibold text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden mb-5">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Step 1 — Reconstitution (once per vial)</p>
                <p className="text-lg font-bold text-black leading-snug">{results!.reconstitution}</p>
              </div>
              <div className="bg-white px-5 py-4">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Step 2 — Dosing (each injection)</p>
                <p className="text-lg font-bold text-black leading-snug">{results!.drawInstruction}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                [results!.bwOverridden ? "Bacteriostatic Water Used" : "Bacteriostatic Water (recommended)", `${results!.bwUsed} ml`],
                ["Doses per Vial", Number.isInteger(results!.totalDoses) ? String(results!.totalDoses) : results!.totalDoses.toFixed(1)],
                ...(results!.supplyLabel ? [["Supply Duration", results!.supplyLabel]] : [["Concentration", `${results!.concentration.toFixed(2)} mg/ml`]]),
              ].map(([label, value]) => (
                <div key={label} className="border border-gray-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-mono font-semibold text-black">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-gray-400 text-center">
              For informational purposes only. Consult a healthcare professional for medical guidance.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
