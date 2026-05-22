import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, UtensilsCrossed, LogOut, ClipboardList, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function Navbar() {
  const navigate = useNavigate();
  const { access_Token } = useAuthStore();
  const { data: user } = useGetMe();
  const { data: cartItems } = useGetCart();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/auth/login");
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Food<span className="text-primary">Del</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Menu
            </Link>
            {access_Token && (
              <Link
                to="/orders"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {access_Token && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-primary text-primary-foreground rounded-full animate-fade-in">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {access_Token && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cart")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth/login")}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
