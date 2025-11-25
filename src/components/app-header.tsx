"use client";

import Link from "next/link";
import {
  Home,
  Menu,
  Package2,
  Search,
  Settings,
  Users,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getCurrentUser } from "@/lib/data";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function AppHeader() {
  const user = getCurrentUser();
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <header className="flex h-16 items-center gap-4 px-4 lg:px-6 sticky top-0 z-30 pt-4">
      <div className="flex flex-1 items-center gap-4 glass rounded-2xl px-4 h-full shadow-lg">
        <SidebarTrigger className="hidden md:flex hover:bg-white/10 text-foreground" />
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col glass border-r-white/10">
            <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold text-foreground"
                >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Ihsan Education Hub</span>
                </Link>
                <Link
                href="/dashboard"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                <Home className="h-5 w-5" />
                Dashboard
                </Link>
                <Link
                href="/dashboard/courses"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                <BookOpen className="h-5 w-5" />
                Courses
                </Link>
                <Link
                href="/dashboard/users"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                <Users className="h-5 w-5" />
                Users
                </Link>
                <Link
                href="/dashboard/settings"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                <Settings className="h-5 w-5" />
                Settings
                </Link>
            </nav>
            </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
            <form>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search..."
                className="w-full appearance-none bg-white/5 border-white/10 pl-8 shadow-none md:w-2/3 lg:w-1/3 text-foreground placeholder:text-muted-foreground focus:bg-white/10 transition-all"
                />
            </div>
            </form>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/20 text-primary">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
                <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">Support</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 text-destructive focus:text-destructive">
                <Link href="/login">Logout</Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
