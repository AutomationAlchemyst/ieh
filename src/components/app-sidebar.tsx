
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookCopy,
  BookUser,
  Home,
  Settings,
  Shuffle,
  Users,
  Wallet,
  PieChart,
  CalendarCheck // Import CalendarCheck
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

const adminNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "Asatizah Management" },
  { href: "/dashboard/students", icon: Users, label: "Student Management" },
  { href: "/dashboard/courses", icon: BookCopy, label: "Course Management" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance Logs" }, // Added here
  { href: "/dashboard/bursary", icon: Wallet, label: "Bursary Management" },
  { href: "/dashboard/reports", icon: PieChart, label: "Reports & Analytics" },
  { href: "/dashboard/matching", icon: Shuffle, label: "Matching Engine" },
];

const managementNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "View Asatizah" },
  { href: "/dashboard/students", icon: Users, label: "View Students" },
  { href: "/dashboard/courses", icon: BookCopy, label: "View Courses" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance Logs" }, // Added here
  { href: "/dashboard/bursary", icon: Wallet, label: "Bursary Management" },
  { href: "/dashboard/reports", icon: PieChart, label: "Reports & Analytics" },
];

const teacherNav:any[] = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/courses", icon: BookCopy, label: "My Courses" },
    { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance" }, // Added here
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

  const userRole: UserRole = userProfile?.role || "student"; // Default to student if unknown
  const currentNav = navItems[userRole] || [];

  if (!firebaseUser) return null; // Or return a skeleton sidebar

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-10 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-base font-semibold font-headline text-sidebar-foreground">Ihsan Hub</h2>
            <Badge variant="secondary" className="w-fit capitalize">{userRole}</Badge>
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
