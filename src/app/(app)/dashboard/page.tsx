"use client";

import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { courses, getCurrentUser, users } from "@/lib/data";

const chartData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

const AdminDashboard = () => (
  <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">+5 since last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{courses.length}</div>
          <p className="text-xs text-muted-foreground">+2 since last quarter</p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    <Card className="lg:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          The latest users who have joined the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {users.slice(0, 5).map(user => (
          <div className="flex items-center gap-4" key={user.id}>
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={user.avatar} alt="Avatar" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto font-medium capitalize">{user.role}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const TeacherDashboard = () => (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>My Courses</CardDescription>
                    <CardTitle className="text-4xl">2</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        You are teaching 2 active courses.
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardDescription>My Students</CardDescription>
                    <CardTitle className="text-4xl">3</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        Across all your courses and groups.
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Title</TableHead>
                                <TableHead className="text-right">Enrolled Students</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.filter(c => c.teacherId === getCurrentUser().id).map(course => (
                            <TableRow key={course.id}>
                                <TableCell>
                                    <div className="font-medium">{course.title}</div>
                                </TableCell>
                                <TableCell className="text-right">{course.studentIds.length}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
        </Card>
    </div>
);

const StudentDashboard = () => (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Enrolled Courses</CardDescription>
                    <CardTitle className="text-4xl">{courses.filter(c => c.studentIds.includes(getCurrentUser().id)).length}</CardTitle>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Completed Modules</CardDescription>
                    <CardTitle className="text-4xl">5 / 8</CardTitle>
                </CardHeader>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid gap-4">
                    {courses.filter(c => c.studentIds.includes(getCurrentUser().id)).map(course => (
                        <Card key={course.id}>
                            <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <CardTitle>{course.title}</CardTitle>
                                    <CardDescription>{course.description}</CardDescription>
                                </div>
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={`/dashboard/courses/${course.id}`}>Go to Course</Link>
                                </Button>
                            </CardHeader>
                        </Card>
                    ))}
                 </div>
            </CardContent>
        </Card>
    </div>
);


const dashboardViews = {
  admin: <AdminDashboard />,
  management: <AdminDashboard />, // Management has a similar view to admin
  teacher: <TeacherDashboard />,
  student: <StudentDashboard />,
};

export default function Dashboard() {
  const user = getCurrentUser();
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl sm:text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Here's what's happening today.</p>
            </div>
        </div>
        
        {dashboardViews[user.role] || <p>No dashboard view available for your role.</p>}
        
      </main>
    </div>
  );
}
