"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Please enter both email and password.",
        });
        return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24 rounded-2xl bg-white/5 p-4 shadow-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <Image
                    src="/images/iehlogo.png"
                    alt="Ihsan Education Hub Logo"
                    width={80}
                    height={80}
                    className="object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]"
                    priority
                />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline tracking-tight text-white drop-shadow-md">
                    Ihsan Hub
                </h1>
                <p className="text-sm text-white/60 mt-2">
                    Secure Access Portal
                </p>
            </div>
        </div>

        {/* Login Card */}
        <Card className="glass border-white/10 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-xl font-medium text-white/90">Welcome Back</CardTitle>
              <CardDescription className="text-white/50">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@mtfa.org"
                      required
                      className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    <Link
                      href="#"
                      className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-300 mt-2">
                  Sign In
                </Button>
              </form>
            </CardContent>
        </Card>

        {/* Footer / Quote */}
        <div className="text-center space-y-4">
            <p className="text-sm text-white/40">
                Protected by MTFA Security
            </p>
            <blockquote className="text-xs italic text-white/30 max-w-xs mx-auto border-l-2 border-white/10 pl-3">
              &ldquo;The best of you are those who learn the Qur'an and teach it.&rdquo;
            </blockquote>
        </div>
      </div>
    </div>
  );
}
