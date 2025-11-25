
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookCopy,
  BookUser,
  Home,
  Settings,
  Shuffle,
  Users,
  Wallet,
  PieChart,
  CalendarCheck,
  Eye
} from "lucide-react";
import { doc } from "firebase/firestore";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons";
import { UserRole } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const adminNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "Asatizah Management" },
  { href: "/dashboard/students", icon: Users, label: "Student Management" },
  { href: "/dashboard/courses", icon: BookCopy, label: "Course Management" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance Logs" }, 
  { href: "/dashboard/bursary", icon: Wallet, label: "Bursary Management" },
  { href: "/dashboard/reports", icon: PieChart, label: "Reports & Analytics" },
  { href: "/dashboard/matching", icon: Shuffle, label: "Matching Engine" },
];

const managementNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "View Asatizah" },
  { href: "/dashboard/students", icon: Users, label: "View Students" },
  { href: "/dashboard/courses", icon: BookCopy, label: "View Courses" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance Logs" }, 
  { href: "/dashboard/bursary", icon: Wallet, label: "Bursary Management" },
  { href: "/dashboard/reports", icon: PieChart, label: "Reports & Analytics" },
];

const teacherNav:any[] = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/courses", icon: BookCopy, label: "My Courses" },
    { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
];

const studentNav:any[] = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/courses", icon: BookCopy, label: "My Courses" },
];

const navItems: Record<UserRole, typeof adminNav> = {
  admin: adminNav,
  management: managementNav,
  teacher: teacherNav,
  student: studentNav,
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { user: firebaseUser } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (firebaseUser && firestore ? doc(firestore, "users", firebaseUser.uid) : null),
    [firebaseUser, firestore]
  );

  const { data: userProfile } = useDoc<any>(userDocRef);

  // Developer Override: Force admin role for specific emails
  const adminEmails = ['ath@mtfa.org', 'atika@mtfa.org', 'nasrullah@mtfa.org'];
  const isDevAdmin = firebaseUser?.email && adminEmails.includes(firebaseUser.email);
  
  const realUserRole: UserRole = isDevAdmin ? "admin" : (userProfile?.role || "student");
  
  // Role Simulation State
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);

  // Sync simulated role with real role initially
  useEffect(() => {
      if (realUserRole && !simulatedRole) {
          setSimulatedRole(realUserRole);
      }
  }, [realUserRole, simulatedRole]);

  const activeRole = simulatedRole || realUserRole;
  const currentNav = navItems[activeRole] || [];

  if (!firebaseUser) return null; 

  return (
    <Sidebar className="border-none bg-transparent">
      <div className="glass m-4 h-[calc(100vh-2rem)] w-full rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <SidebarHeader className="p-4 pb-0">
            <div className="flex items-center gap-3 px-2">
            <Logo className="size-8 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div className="flex flex-col">
                <h2 className="text-lg font-bold font-headline tracking-tight text-foreground">Ihsan Hub</h2>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="w-fit capitalize text-[10px] px-1.5 py-0 h-5 bg-white/10 hover:bg-white/20 border-white/10 backdrop-blur-md">{activeRole}</Badge>
                    {isDevAdmin && activeRole !== "admin" && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1 border-primary/30 text-primary">View Mode</Badge>
                    )}
                </div>
            </div>
            </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
            <SidebarMenu>
            {currentNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={item.label}
                    className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-white/5 transition-all duration-200 rounded-lg px-3 py-2"
                >
                    <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 pt-0">
            {isDevAdmin && (
                <div className="px-2 mb-4">
                    <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        <Eye className="h-3 w-3" />
                        <span>Simulate View</span>
                    </div>
                    <Select value={activeRole} onValueChange={(val) => setSimulatedRole(val as UserRole)}>
                        <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs focus:ring-primary/50">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <Separator className="my-2 bg-white/10" />
            <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="hover:bg-white/5 rounded-lg">
                <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
