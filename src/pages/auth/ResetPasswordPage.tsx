import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyResetOtp, useResetPassword } from "@/lib/hooks";
import { toast } from "sonner";
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(defaultEmail);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyResetOtp();
  const { mutate: reset, isPending: isResetting } = useResetPassword();

  const otpForm = useForm<{ email: string; otp: string }>({
    defaultValues: { email: defaultEmail },
  });
  const passForm = useForm<{ password: string; confirmPassword: string }>();

  const onVerifyOtp = (data: { email: string; otp: string }) => {
    setVerifiedEmail(data.email);
    verifyOtp(data, {
      onSuccess: () => {
        toast.success("OTP verified! Set your new password");
        setOtpVerified(true);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Invalid OTP"),
    });
  };

  const onResetPassword = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    reset(
      {
        email: verifiedEmail,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully! Sign in now 🎉");
          navigate("/auth/login");
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Reset failed"),
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {otpVerified ? "New password" : "Verify OTP"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {otpVerified
              ? "Choose a strong new password"
              : "Enter the OTP we sent to your email"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 p-7">
          {!otpVerified ? (
            /* ── Step 1: Verify OTP ── */
            <form
              onSubmit={otpForm.handleSubmit(onVerifyOtp)}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Email address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  className="h-11 rounded-xl"
                  {...otpForm.register("email", { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">OTP Code</Label>
                <Input
                  id="reset-otp"
                  placeholder="123456"
                  maxLength={6}
                  className="h-14 rounded-xl text-center text-3xl tracking-[0.6em] font-mono"
                  {...otpForm.register("otp", {
                    required: true,
                    minLength: 6,
                  })}
                />
              </div>

              <Button
                id="verify-otp-submit"
                type="submit"
                className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying…" : "Verify OTP"}
              </Button>
            </form>
          ) : (
            /* ── Step 2: New password ── */
            <form
              onSubmit={passForm.handleSubmit(onResetPassword)}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 characters"
                    className="h-11 rounded-xl pr-11"
                    {...passForm.register("password", {
                      required: true,
                      minLength: 8,
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    className={`h-11 rounded-xl pr-11 ${
                      passForm.formState.errors.confirmPassword
                        ? "border-destructive"
                        : ""
                    }`}
                    {...passForm.register("confirmPassword", {
                      required: true,
                      validate: (v) =>
                        v === passForm.watch("password") ||
                        "Passwords don't match",
                    })}
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
                {passForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {passForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                id="reset-password-submit"
                type="submit"
                className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
                disabled={isResetting}
              >
                {isResetting ? "Resetting…" : "Reset Password"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm mt-6">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
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
