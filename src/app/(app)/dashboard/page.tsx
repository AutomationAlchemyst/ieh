"use client";

import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { User, Course } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Users,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

const AdminDashboard = ({ allUsers, allCourses, teachers, students }: { allUsers: User[], allCourses: Course[], teachers: User[], students: any[] }) => (
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
    
  </div>
);



export default function Dashboard() {
  const firestore = useFirestore();

  const usersCollectionRef = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const { data: allUsers, isLoading: areUsersLoading } = useCollection<User>(usersCollectionRef);

  const coursesCollectionRef = useMemoFirebase(() => collection(firestore, "courses"), [firestore]);
  const { data: allCourses, isLoading: areCoursesLoading } = useCollection<Course>(coursesCollectionRef);

  const registrationsCollectionRef = useMemoFirebase(() => collection(firestore, "registrations"), [firestore]);
  const { data: allRegistrations, isLoading: areRegistrationsLoading } = useCollection<any>(registrationsCollectionRef);
  
  const isLoading = areUsersLoading || areCoursesLoading || areRegistrationsLoading;

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

  const teachers = allUsers ? allUsers.filter(u => u.role === 'teacher') : [];
  const students = allRegistrations || [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome back!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Here's what's happening today.</p>
            </div>
        </div>
        
        <AdminDashboard allUsers={allUsers || []} allCourses={allCourses || []} teachers={teachers} students={students} />
        
      </main>
    </div>
  );
}
