import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForgotPassword } from "@/lib/hooks";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: sendOtp, isPending } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    sendOtp(data, {
      onSuccess: () => {
        toast.success("Reset OTP sent to your email 📧");
        navigate(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to send OTP"),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <KeyRound className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <Card className="border-border/60 shadow-xl shadow-black/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
            <CardDescription>Enter your email and we'll send you a reset OTP</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending OTP..." : "Send Reset OTP"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-5">
              <Link to="/auth/login" className="text-primary hover:underline">← Back to login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
