import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building2, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Job — Zumert" },
      { name: "description", content: "Post a new job listing on Zumert." },
    ],
  }),
  component: PostJobPage,
});

function PostJobPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pb-safe-nav">
        <div className="bg-gradient-hero px-5 pb-8 pt-12">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary-foreground">Post a Job</h1>
        </div>
        <div className="mx-auto max-w-lg px-5 mt-8 text-center">
          <p className="text-muted-foreground mb-4">You need to be logged in to post a job.</p>
          <Link to="/login">
            <Button variant="gradient" size="lg" className="rounded-xl">Log In</Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) {
      toast.error("Title and company are required");
      return;
    }
    setLoading(true);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const logo = company.substring(0, 2).toUpperCase();

    const { error } = await supabase.from("jobs").insert({
      title,
      company,
      location,
      salary,
      type,
      logo,
      tags,
      user_id: user!.id,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Job posted successfully!");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen pb-safe-nav">
      <div className="bg-gradient-hero px-5 pb-8 pt-12">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold text-primary-foreground">Post a Job</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">Reach thousands of candidates</p>
      </div>

      <div className="mx-auto max-w-lg px-5 -mt-3">
        <div className="rounded-2xl bg-card p-5 shadow-elevated">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="e.g. Senior React Developer" className="pl-10" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Your company name" className="pl-10" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="City, State" className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="e.g. 100k-150k" className="pl-10" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Job Type</label>
              <div className="flex gap-2">
                {["Full-time", "Part-time", "Contract", "Remote"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      type === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Tags (comma separated)</label>
              <Input placeholder="React, TypeScript, Remote" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea placeholder="Describe the role, requirements, and benefits..." className="min-h-[120px] pl-10" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>

            <Button variant="gradient" size="lg" className="mt-2 w-full rounded-xl text-base" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Publish Job
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
