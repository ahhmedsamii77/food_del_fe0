import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  UtensilsCrossed,
  LogOut,
  ClipboardList,
  LogIn,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/auth";
import { useGetMe, useGetCart, useLogout } from "@/lib/hooks";
import { toast } from "sonner";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { access_Token } = useAuthStore();
  const { data: user } = useGetMe();
  const { data: cartItems } = useGetCart();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/auth/login");
        setMobileOpen(false);
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div className="glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-200">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Food<span className="text-gradient-orange">Del</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                Menu
              </Link>
              {access_Token && (
                <Link
                  to="/orders"
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                >
                  My Orders
                </Link>
              )}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              {access_Token && (
                <Button
                  id="nav-cart-btn"
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-[18px] w-[18px]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full animate-badge-pop">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Button>
              )}

              {/* User dropdown or sign in */}
              {access_Token && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        id="nav-user-menu"
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 p-0"
                      >
                        <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-1">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-56 mt-1">
                    <div className="px-3 py-2.5 border-b border-border mb-1">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuItem
                      id="nav-orders-link"
                      onClick={() => navigate("/orders")}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      id="nav-cart-link"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart{cartCount > 0 && ` (${cartCount})`}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      id="nav-logout-btn"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/8"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? "Logging out…" : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  id="nav-signin-btn"
                  size="sm"
                  className="gap-1.5 hidden md:inline-flex"
                  onClick={() => navigate("/auth/login")}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}

              {/* Mobile hamburger */}
              <Button
                id="nav-mobile-menu"
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="glass border-b border-border/50 md:hidden animate-fade-in-fast">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              to="/"
              className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Menu
            </Link>
            {access_Token && (
              <Link
                to="/orders"
                className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            )}
            {!access_Token && (
              <Button
                id="nav-mobile-signin"
                className="mt-1 w-full gap-2"
                onClick={() => {
                  navigate("/auth/login");
                  setMobileOpen(false);
                }}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
