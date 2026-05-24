import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/lib/hooks";
import { sendResetPasswordOtpSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { KeyRound, ArrowLeft } from "lucide-react";
import { z } from "zod";

type ForgotPasswordFormData = z.infer<typeof sendResetPasswordOtpSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: sendOtp, isPending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(sendResetPasswordOtpSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendOtp(data, {
      onSuccess: () => {
        toast.success("Reset OTP sent to your email 📧");
        navigate(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to send OTP"),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <KeyRound className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">Forgot password?</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Enter your email and we'll send you a reset OTP
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
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

            <Button
              id="forgot-submit"
              type="submit"
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? "Sending OTP…" : "Send Reset OTP"}
            </Button>
          </form>

          <p className="text-center text-sm mt-6">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
