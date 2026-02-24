import { Sidebar } from "@/components/Sidebar";

export function TutorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 sm:py-10 max-w-3xl">
        {children}
      </main>
    </div>
  );
}
