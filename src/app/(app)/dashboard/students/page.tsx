
"use client";

import { useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { User } from "@/lib/data";

import { DataTable } from "../users/data-table";
import { columns } from "../users/columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BeneficiaryRegistrationForm } from "./beneficiary-registration-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsPage() {
  const firestore = useFirestore();
  const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const studentsQuery = useMemoFirebase(() => query(usersCollection, where("role", "==", "student")), [usersCollection]);
  
  const { data: students, isLoading } = useCollection<User>(studentsQuery);
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Student Management</h1>
          <p className="text-muted-foreground">
            View, add, edit, and manage all students in the system.
          </p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new student account.
                    </DialogDescription>
                </DialogHeader>
                <BeneficiaryRegistrationForm />
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>A list of all registered students.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={students || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
