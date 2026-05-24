import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/hooks";
import { toast } from "sonner";
import { signupSchema } from "@/lib/validations/auth";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type SignupFormData = z.infer<typeof signupSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "male",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    // Map username to name for the backend API
    const payload = {
      name: data.username,
      email: data.email,
      password: data.password,
    };

    registerUser(payload, {
      onSuccess: () => {
        toast.success("Account created! Check your email for the OTP 📧");
        navigate(`/auth/confirm-email?email=${encodeURIComponent(data.email)}`);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Registration failed");
      },
    });
  };

  const selectedGender = watch("gender");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="w-full max-w-md animate-fade-in my-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join <span className="text-primary font-semibold">FoodDel</span> and start ordering
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                placeholder="JohnDoe"
                className={`h-11 rounded-xl ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`h-11 rounded-xl ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
              <Input
                id="phone"
                placeholder="+20 123 456 7890"
                className={`h-11 rounded-xl ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center gap-2 h-11 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedGender === "male"
                      ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                      : "border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="male"
                    className="sr-only"
                    {...register("gender")}
                  />
                  <span>👨 Male</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 h-11 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedGender === "female"
                      ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                      : "border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="female"
                    className="sr-only"
                    {...register("gender")}
                  />
                  <span>👩 Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  className={`h-11 rounded-xl pr-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("password")}
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

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  className={`h-11 rounded-xl pr-11 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              id="register-submit"
              type="submit"
              className="w-full h-11 rounded-xl text-base font-semibold mt-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              disabled={isPending}
            >
              {isPending ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
