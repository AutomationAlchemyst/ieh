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
import { Logo } from "@/components/icons";
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
      // For this demo, we'll sign in with the provided email and password.
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden h-full bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/loginbg/1920/1080"
          alt="Abstract background image"
          data-ai-hint="abstract geometric"
          fill
          className="object-cover"
        />
        <div className="relative z-10 flex h-full flex-col justify-end bg-black/40 p-10 text-white">
          <div className="mb-4 inline-flex items-center gap-3 text-2xl font-bold font-headline">
            <Logo className="h-10 w-10" />
            Ihsan Education Hub
          </div>
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best of you are those who learn the Qur'an and teach
              it.&rdquo;
            </p>
            <footer className="text-sm">Prophetic Saying (Hadith)</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline text-primary">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
              <CardDescription>
                Use your credentials to access the portal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="pl-9"
                      
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="pl-9"
                      placeholder="••••••••"
                      
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Contact administration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
