import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirmEmail, useResendOtp } from "@/lib/hooks";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);

  const { mutate: confirm, isPending } = useConfirmEmail();
  const { mutate: resend, isPending: isResending } = useResendOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; otp: string }>({
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = (data: { email: string; otp: string }) => {
    setEmail(data.email);
    confirm(data, {
      onSuccess: () => {
        toast.success("Email confirmed! You can now sign in 🎉");
        navigate("/auth/login");
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Invalid OTP"),
    });
  };

  const handleResend = () => {
    if (!email) return toast.error("Enter your email first");
    resend(
      { email },
      {
        onSuccess: () => toast.success("New OTP sent to your email 📧"),
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to resend OTP"),
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-4">
            <Mail className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">Check your email</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
            We sent a 6-digit OTP to your email. Enter it below to confirm your account.
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
                className={`h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                {...register("email", { required: "Email is required" })}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* OTP input — big mono digits */}
            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-sm font-medium">
                OTP Code
              </Label>
              <Input
                id="otp"
                placeholder="123456"
                maxLength={6}
                className={`h-14 rounded-xl text-center text-3xl tracking-[0.6em] font-mono ${
                  errors.otp ? "border-destructive" : ""
                }`}
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                })}
              />
              {errors.otp && (
                <p className="text-xs text-destructive">{errors.otp.message}</p>
              )}
            </div>

            <Button
              id="confirm-submit"
              type="submit"
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              disabled={isPending}
            >
              {isPending ? "Confirming…" : "Confirm Email"}
            </Button>
          </form>

          {/* Resend */}
          <div className="mt-5 text-center space-y-3">
            <button
              type="button"
              id="resend-otp-btn"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-primary hover:underline font-medium disabled:opacity-50"
            >
              {isResending ? "Sending…" : "Didn't get it? Resend OTP"}
            </button>

            <p className="text-sm">
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
    </div>
  );
}
