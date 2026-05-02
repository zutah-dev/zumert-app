import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Settings, Bookmark, FileText, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Zumert" },
      { name: "description", content: "Your Zumert profile and settings." },
    ],
  }),
  component: ProfilePage,
});

const menuItems = [
  { icon: Bookmark, label: "Saved Jobs" },
  { icon: FileText, label: "My Applications" },
  { icon: Settings, label: "Settings" },
];

function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; location: string | null; bio: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, email, location, bio")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-safe-nav">
        <div className="bg-gradient-hero px-5 pb-10 pt-12">
          <h1 className="font-display text-xl font-bold text-primary-foreground">Profile</h1>
        </div>
        <div className="mx-auto max-w-lg px-5 -mt-6">
          <div className="rounded-2xl bg-card p-5 shadow-elevated text-center">
            <p className="text-muted-foreground mb-4">Sign in to view your profile</p>
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <Button variant="gradient" size="lg" className="w-full rounded-xl">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="w-full rounded-xl">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen pb-safe-nav">
      <div className="bg-gradient-hero px-5 pb-10 pt-12">
        <h1 className="font-display text-xl font-bold text-primary-foreground">Profile</h1>
      </div>

      <div className="mx-auto max-w-lg px-5 -mt-6">
        <div className="rounded-2xl bg-card p-5 shadow-elevated text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold font-display text-accent-foreground">
            {initials}
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-card-foreground">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
          {profile?.location && (
            <p className="mt-1 text-xs text-muted-foreground">{profile.location}</p>
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-card">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent ${
                i !== menuItems.length - 1 ? "border-b" : ""
              }`}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button onClick={handleSignOut} className="mx-auto mt-6 flex items-center gap-2 text-sm text-destructive">
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
