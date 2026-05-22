import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyResetOtp, useResetPassword } from "@/lib/hooks";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(defaultEmail);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyResetOtp();
  const { mutate: reset, isPending: isResetting } = useResetPassword();

  const otpForm = useForm<{ email: string; otp: string }>({ defaultValues: { email: defaultEmail } });
  const passForm = useForm<{ password: string; confirmPassword: string }>();

  const onVerifyOtp = (data: { email: string; otp: string }) => {
    setVerifiedEmail(data.email);
    verifyOtp(data, {
      onSuccess: () => {
        toast.success("OTP verified! Set your new password");
        setOtpVerified(true);
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || "Invalid OTP"),
    });
  };

  const onResetPassword = (data: { password: string; confirmPassword: string }) => {
    reset({ email: verifiedEmail, password: data.password, confirmPassword: data.confirmPassword }, {
      onSuccess: () => {
        toast.success("Password reset successfully! Sign in now 🎉");
        navigate("/auth/login");
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || "Reset failed"),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <Card className="border-border/60 shadow-xl shadow-black/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {otpVerified ? "New password" : "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {otpVerified ? "Choose a strong new password" : "Enter the OTP we sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpVerified ? (
              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" {...otpForm.register("email", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>OTP Code</Label>
                  <Input
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    {...otpForm.register("otp", { required: true, minLength: 6 })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={passForm.handleSubmit(onResetPassword)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Min 8 characters"
                    {...passForm.register("password", { required: true, minLength: 8 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Repeat password"
                    {...passForm.register("confirmPassword", {
                      required: true,
                      validate: (v) => v === passForm.watch("password") || "Passwords don't match",
                    })}
                  />
                  {passForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
            <p className="text-center text-sm text-muted-foreground mt-5">
              <Link to="/auth/login" className="text-primary hover:underline">← Back to login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
