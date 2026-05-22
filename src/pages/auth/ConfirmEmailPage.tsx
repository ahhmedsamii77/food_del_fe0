import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfirmEmail, useResendOtp } from "@/lib/hooks";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);

  const { mutate: confirm, isPending } = useConfirmEmail();
  const { mutate: resend, isPending: isResending } = useResendOtp();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; otp: string }>({
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = (data: { email: string; otp: string }) => {
    setEmail(data.email);
    confirm(data, {
      onSuccess: () => {
        toast.success("Email confirmed! You can now sign in 🎉");
        navigate("/auth/login");
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || "Invalid OTP"),
    });
  };

  const handleResend = () => {
    if (!email) return toast.error("Enter your email first");
    resend({ email }, {
      onSuccess: () => toast.success("New OTP sent to your email 📧"),
      onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to resend OTP"),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Mail className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <Card className="border-border/60 shadow-xl shadow-black/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit OTP to your email. Enter it below to confirm your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  {...register("otp", { required: "OTP is required", minLength: { value: 6, message: "OTP must be 6 digits" } })}
                />
                {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Confirming..." : "Confirm Email"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Didn't get it? Resend OTP"}
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link to="/auth/login" className="hover:underline">← Back to login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
