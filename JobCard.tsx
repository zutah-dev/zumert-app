import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  logo: string;
  tags: string[];
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="shadow-card border-border/50 transition-all active:scale-[0.98]">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold font-display text-accent-foreground">
            {job.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display font-semibold text-card-foreground">{job.title}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {job.posted}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[11px] font-medium">{job.type}</Badge>
          {job.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[11px] font-normal">{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
