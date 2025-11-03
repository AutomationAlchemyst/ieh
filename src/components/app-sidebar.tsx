
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookCopy,
  BookUser,
  Home,
  Settings,
  Shield,
  Shuffle,
  Users,
  Users2,
  GraduationCap
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons";
import { getCurrentUser, UserRole } from "@/lib/data";
import { Badge } from "./ui/badge";

const adminNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "Asatizah Management" },
  { href: "/dashboard/students", icon: Users, label: "Student Management" },
  { href: "/dashboard/courses", icon: BookCopy, label: "Course Management" },
  { href: "/dashboard/matching", icon: Shuffle, label: "Matching Engine" },
];

const managementNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/asatizah", icon: BookUser, label: "View Asatizah" },
  { href: "/dashboard/students", icon: Users, label: "View Students" },
  { href: "/dashboard/courses", icon: BookCopy, label: "View Courses" },
];

const teacherNav:any[] = [
  // Access removed for teachers as per instruction
];

const studentNav:any[] = [
  // Access removed for students as per instruction
];

const navItems: Record<UserRole, typeof adminNav> = {
  admin: adminNav,
  management: managementNav,
  teacher: teacherNav,
  student: studentNav,
};

export default function AppSidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const currentNav = navItems[user.role] || [];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-10 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-base font-semibold font-headline text-sidebar-foreground">Ihsan Hub</h2>
            <Badge variant="secondary" className="w-fit">{user.role}</Badge>
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
