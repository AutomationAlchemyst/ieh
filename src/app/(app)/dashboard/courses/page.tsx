
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
import { courses, users, getCurrentUser, getUserById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddCourseForm } from "./add-course-form";

export default function CoursesPage() {
    const currentUser = getCurrentUser();
    const canCreateCourse = currentUser.role === 'admin';
    const displayedCourses = courses;

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedCourses.map((course) => {
            const teacher = getUserById(course.teacherId);
            return (
                <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        data-ai-hint="education learning"
                        className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <Badge variant="secondary" className="mb-2">{course.modules.length} Modules</Badge>
                        <CardTitle className="font-headline text-xl leading-tight">{course.title}</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-6 pt-0">
                    <CardDescription>{course.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-6 bg-muted/50">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Instructor:</span>
                            <span className="font-medium">{teacher?.name || 'N/A'}</span>
                        </div>
                        <Button asChild size="sm">
                            <Link href={`/dashboard/courses/${course.id}`}>View Course</Link>
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
