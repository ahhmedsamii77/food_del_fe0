import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "sonner";
import type { LoginForm } from "@/types";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAccess_Token, setRefresh_Token, setRole } = useAuthStore();
  const { mutate: login, isPending } = useLogin();
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: (res) => {
        const { credentials, role } = res.data.data;
        setAccess_Token(credentials.access_token);
        setRefresh_Token(credentials.refresh_token);
        setRole(role);
        toast.success("Welcome back! 🍕");
        navigate("/");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Login failed";
        if (msg.includes("confirm your email")) {
          toast.error(msg, {
            action: {
              label: "Confirm now",
              onClick: () => navigate("/auth/confirm-email"),
            },
          });
        } else {
          toast.error(msg);
        }
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your <span className="text-primary font-semibold">FoodDel</span> account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 rounded-xl pr-11 ${errors.password ? "border-destructive" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              id="login-submit"
              type="submit"
              className="w-full h-11 rounded-xl text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              disabled={isPending}
            >
              {isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
