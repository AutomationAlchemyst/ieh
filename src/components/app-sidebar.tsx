
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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-10 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-base font-semibold font-headline text-sidebar-foreground">Ihsan Hub</h2>
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="w-fit capitalize">{activeRole}</Badge>
                {isDevAdmin && activeRole !== "admin" && (
                    <Badge variant="outline" className="text-[10px] h-5 px-1">View Mode</Badge>
                )}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {isDevAdmin && (
            <div className="px-2 mb-2">
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>Simulate View</span>
                </div>
                <Select value={activeRole} onValueChange={(val) => setSimulatedRole(val as UserRole)}>
                    <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        )}
        <Separator className="my-2 bg-sidebar-border" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
