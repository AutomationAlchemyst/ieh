
"use client";

import { useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import type { User } from "@/lib/data";
import { exportToCsv } from "@/lib/utils";

import { DataTable } from "../users/data-table";
import { columns } from "../users/columns";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddUserForm } from "../users/add-user-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function AsatizahPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const asatizahQuery = useMemoFirebase(() => query(usersCollection, where("role", "==", "teacher")), [usersCollection]);
  
  const { data: asatizah, isLoading: isDataLoading } = useCollection<User>(
    user ? asatizahQuery : null
  );

  const isLoading = isAuthLoading || isDataLoading;

  const handleExport = () => {
    if (asatizah) {
      exportToCsv(asatizah, "asatizah-export.csv");
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Asatizah Management</h1>
          <p className="text-muted-foreground">
            View, add, edit, and manage all teachers in the system.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="w-full sm:w-auto" onClick={handleExport} disabled={!asatizah || asatizah.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Dialog>
              <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Asatizah
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                      <DialogTitle>Add New Asatizah</DialogTitle>
                      <DialogDescription>
                          Fill in the details below to create a new teacher account.
                      </DialogDescription>
                  </DialogHeader>
                  <AddUserForm defaultRole="teacher" />
              </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Asatizah</CardTitle>
          <CardDescription>A list of all registered teachers.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={asatizah || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
