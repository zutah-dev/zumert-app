import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/JobCard";
import { BottomNav } from "@/components/BottomNav";
import { sampleJobs } from "@/data/jobs";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Jobs — Zumert" },
      { name: "description", content: "Search and filter job listings on Zumert." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const filtered = sampleJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-safe-nav">
      <div className="sticky top-0 z-40 bg-gradient-hero px-5 pb-6 pt-12 shadow-card">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-xl font-bold text-primary-foreground">Search</h1>
          <p className="mt-1 text-sm text-primary-foreground/80">Find your perfect role</p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Job title, company, skill..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-xl border-none bg-card pl-10 shadow-elevated"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 pt-4">
        <p className="mb-3 text-sm text-muted-foreground">{filtered.length} results</p>
        <div className="flex flex-col gap-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-semibold text-foreground">No jobs found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
