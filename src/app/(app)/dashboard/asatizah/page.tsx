
"use client";

import { useMemo, useState } from "react";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import type { User } from "@/lib/data";
import { exportToCsv } from "@/lib/utils";

import { DataTable } from "../users/data-table";
import { columns } from "./columns"; // Use specific columns
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AsatizahPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [filterStatus, setFilterStatus] = useState<string>("Verified"); // Default to Verified for Teachers

  const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  // Fetch all teachers
  const asatizahQuery = useMemoFirebase(() => query(usersCollection, where("role", "==", "teacher")), [usersCollection]);
  
  const { data: asatizah, isLoading: isDataLoading } = useCollection<User>(
    user ? asatizahQuery : null
  );

  const isLoading = isAuthLoading || isDataLoading;

  const filteredData = useMemo(() => {
    if (!asatizah) return [];
    if (filterStatus === "All") return asatizah;
    
    return asatizah.filter(teacher => {
       const status = teacher.verificationStatus || "New"; // Default undefined to 'New'
       return status === filterStatus;
    });
  }, [asatizah, filterStatus]);

  const handleExport = () => {
    if (filteredData) {
      exportToCsv(filteredData, `asatizah-${filterStatus}.csv`);
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Asatizah Management</h1>
          <p className="text-muted-foreground">
            View, verify, and manage teacher profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="w-full sm:w-auto" onClick={handleExport} disabled={!filteredData || filteredData.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
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

      <Tabs defaultValue="Verified" onValueChange={setFilterStatus} className="w-full">
        <TabsList>
          <TabsTrigger value="New">Verification Queue (New)</TabsTrigger>
          <TabsTrigger value="Verified">Verified Teachers</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
          <TabsTrigger value="All">All Teachers</TabsTrigger>
        </TabsList>

        <Card className="mt-4">
            <CardHeader>
            <CardTitle>{filterStatus === 'All' ? 'All Asatizah' : `${filterStatus} Asatizah`}</CardTitle>
            <CardDescription>
                {filterStatus === 'New' 
                ? "Review and approve new teacher registrations." 
                : `Viewing ${filterStatus.toLowerCase()} teacher profiles.`}
            </CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <DataTable columns={columns} data={filteredData || []} />
            )}
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
