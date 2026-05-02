import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/JobCard";
import { BottomNav } from "@/components/BottomNav";
import { sampleJobs } from "@/data/jobs";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/components/JobCard";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zumert — Find Your Next Opportunity" },
      { name: "description", content: "Discover amazing jobs at top companies with Zumert." },
    ],
  }),
  component: HomePage,
});

const categories = ["All", "Remote", "Full-time", "Contract", "Part-time"] as const;

function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Job[] = data.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          salary: j.salary,
          type: j.type,
          posted: formatDistanceToNow(new Date(j.created_at), { addSuffix: true }),
          logo: j.logo || j.company.substring(0, 2).toUpperCase(),
          tags: j.tags ?? [],
        }));
        setJobs(mapped);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Remote") return job.tags.includes("Remote");
    return job.type === activeCategory;
  });

  return (
    <div className="min-h-screen pb-safe-nav">
      <div className="bg-gradient-hero px-5 pb-8 pt-12">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-2xl font-bold text-primary-foreground">Zumert</h1>
          <p className="mt-1 text-sm text-primary-foreground/80">Find your dream job today</p>

          <div className="relative mt-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search jobs, companies..." className="h-11 rounded-xl border-none bg-card pl-10 pr-11 shadow-elevated" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent p-1.5 text-accent-foreground">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5">
        <div className="-mt-3 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card text-muted-foreground shadow-card"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Jobs</h2>
            <span className="text-xs text-muted-foreground">{filteredJobs.length} jobs</span>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {loading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading jobs...</p>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No jobs found for "{activeCategory}"
              </p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
