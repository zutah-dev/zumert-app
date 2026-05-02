import { Link } from "@tanstack/react-router";
import { Home, Search, PlusCircle, User } from "lucide-react";

const navItems = [
  { to: "/" as const, icon: Home, label: "Home" },
  { to: "/search" as const, icon: Search, label: "Search" },
  { to: "/post-job" as const, icon: PlusCircle, label: "Post" },
  { to: "/profile" as const, icon: User, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
