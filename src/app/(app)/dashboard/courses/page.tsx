
"use client";

import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddCourseForm } from "./add-course-form";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, Course } from "@/lib/data";

export default function CoursesPage() {
    const { user: firebaseUser } = useUser();
    const firestore = useFirestore();

    const [filterStatus, setFilterStatus] = useState<string>("Ongoing");

    // Fetch Courses
    const coursesCollection = useMemoFirebase(() => query(collection(firestore, "courses"), orderBy("createdAt", "desc")), [firestore]);
    const { data: courses, isLoading: isCoursesLoading } = useCollection<any>(coursesCollection);

    // Fetch Users to resolve teacher names and check permissions
    const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
    const { data: users, isLoading: isUsersLoading } = useCollection<User>(usersCollection);

    const currentUserProfile = users?.find(u => u.id === firebaseUser?.uid);
    const canCreateCourse = currentUserProfile?.role === 'admin';

    const displayedCourses = useMemo(() => {
        if (!courses) return [];
        return courses.filter((c: any) => (c.status || "Ongoing") === filterStatus);
    }, [courses, filterStatus]);

    const getUserName = (id: string) => {
        return users?.find(u => u.id === id)?.name || 'Unknown Instructor';
    };

    const isLoading = isCoursesLoading || isUsersLoading;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Courses</h1>
          <p className="text-muted-foreground">
            Browse and manage all available courses.
          </p>
        </div>
        {canCreateCourse && (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new course.
                        </DialogDescription>
                    </DialogHeader>
                    <AddCourseForm />
                </DialogContent>
            </Dialog>
        )}
      </div>

      <Tabs defaultValue="Ongoing" onValueChange={setFilterStatus} className="w-full">
        <TabsList>
            <TabsTrigger value="Ongoing">Ongoing Courses</TabsTrigger>
            <TabsTrigger value="Completed">Completed / Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="mt-6">
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[350px] w-full rounded-xl" />
                    <Skeleton className="h-[350px] w-full rounded-xl" />
                    <Skeleton className="h-[350px] w-full rounded-xl" />
                </div>
            ) : displayedCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No {filterStatus.toLowerCase()} courses found.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedCourses.map((course: any) => (
                        <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="p-0">
                            <div className="relative h-48 w-full bg-muted">
                                {course.thumbnail ? (
                                    <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <div className="p-6 pb-2">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge variant="secondary">{course.modules?.length || 0} Modules</Badge>
                                    {course.tags?.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                    ))}
                                </div>
                                <CardTitle className="font-headline text-xl leading-tight line-clamp-2">{course.title}</CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent className="flex-grow p-6 pt-2">
                                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center p-6 bg-muted/50 mt-auto">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Instructor:</span>
                                    <span className="font-medium truncate max-w-[100px]">{getUserName(course.teacherId)}</span>
                                </div>
                                <Button asChild size="sm">
                                    <Link href={`/dashboard/courses/${course.id}`}>View Course</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
