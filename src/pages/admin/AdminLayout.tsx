import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks";
import { toast } from "sonner";

const NAV = [
  { to: "/admin",        label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/foods",  label: "Foods",     icon: UtensilsCrossed },
  { to: "/admin/orders", label: "Orders",    icon: ClipboardList },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out");
        navigate("/auth/login");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-border flex flex-col bg-card">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-extrabold text-base leading-tight">FoodDel</p>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <Button
            id="admin-logout"
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/8 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
