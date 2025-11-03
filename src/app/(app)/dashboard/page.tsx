"use client";

import { useMemo } from "react";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { User, Course } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

import {
  BookOpen,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

const chartData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
];

const AdminDashboard = ({ allUsers, allCourses, recentUsers, teachers, students }: { allUsers: User[], allCourses: Course[], recentUsers: User[], teachers: User[], students: any[] }) => (
  <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Asatizah</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teachers.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students.length}</div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    <Card className="lg:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>The latest users who have joined the platform.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentUsers.map(user => (
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

const TeacherDashboard = ({ currentUser, allCourses }: { currentUser: User, allCourses: Course[] }) => {
    const myCourses = allCourses.filter(c => c.teacherId === currentUser.id);
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>My Courses</CardDescription>
                        <CardTitle className="text-4xl">{myCourses.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">You are teaching {myCourses.length} active courses.</div>
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
                                {myCourses.map(course => (
                                <TableRow key={course.id}>
                                    <TableCell><div className="font-medium">{course.title}</div></TableCell>
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
}

const StudentDashboard = ({ currentUser, allCourses }: { currentUser: User, allCourses: Course[] }) => {
    const myCourses = allCourses.filter(c => c.studentIds.includes(currentUser.id));
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Enrolled Courses</CardDescription>
                        <CardTitle className="text-4xl">{myCourses.length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {myCourses.map(course => (
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
}

export default function Dashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => authUser ? doc(firestore, "users", authUser.uid) : null, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileRef);

  const usersCollectionRef = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const { data: allUsers, isLoading: areUsersLoading } = useCollection<User>(usersCollectionRef);

  const coursesCollectionRef = useMemoFirebase(() => collection(firestore, "courses"), [firestore]);
  const { data: allCourses, isLoading: areCoursesLoading } = useCollection<Course>(coursesCollectionRef);

  const registrationsCollectionRef = useMemoFirebase(() => collection(firestore, "registrations"), [firestore]);
  const { data: allRegistrations, isLoading: areRegistrationsLoading } = useCollection<any>(registrationsCollectionRef);
  
  const recentUsersQuery = useMemoFirebase(() => query(usersCollectionRef, orderBy("createdAt", "desc"), limit(5)), [usersCollectionRef]);
  const { data: recentUsers, isLoading: areRecentUsersLoading } = useCollection<User>(recentUsersQuery);

  const isLoading = isAuthLoading || isProfileLoading || areUsersLoading || areCoursesLoading || areRecentUsersLoading || areRegistrationsLoading;

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Skeleton className="h-16 w-1/2" />
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-96 lg:col-span-2" />
                    <Skeleton className="h-96 xl:col-span-1" />
                </div>
            </main>
        </div>
    );
  }

  if (!userProfile) {
    return <p>Could not load user profile. Please try again.</p>;
  }

  const teachers = allUsers ? allUsers.filter(u => u.role === 'teacher') : [];
  const students = allRegistrations || [];

  const userInitials = userProfile.name.split(' ').map(n => n[0]).join('');

  const dashboardViews: { [key: string]: React.ReactNode } = {
    admin: <AdminDashboard allUsers={allUsers || []} allCourses={allCourses || []} recentUsers={recentUsers || []} teachers={teachers} students={students} />,
    management: <AdminDashboard allUsers={allUsers || []} allCourses={allCourses || []} recentUsers={recentUsers || []} teachers={teachers} students={students} />,
    teacher: <TeacherDashboard currentUser={userProfile} allCourses={allCourses || []} />,
    student: <StudentDashboard currentUser={userProfile} allCourses={allCourses || []} />,
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-xl sm:text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome back, {userProfile.name.split(' ')[0]}!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Here's what's happening today.</p>
            </div>
        </div>
        
        {dashboardViews[userProfile.role] || <p>No dashboard view available for your role.</p>}
        
      </main>
    </div>
  );
}
