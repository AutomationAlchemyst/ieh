
"use client";

import { useMemo, useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { DataTable } from "../users/data-table";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeneficiaryRegistrationForm } from "./beneficiary-registration-form";
import { columns, ApplicantRow } from "./registration-columns"; // Import ApplicantRow correctly
import { exportToCsv } from "@/lib/utils";

// Define Registration type matching Firestore data
type Registration = {
  id: string;
  name: string;
  additionalApplicants?: any[];
  status?: string;
  wantsToHost?: 'Yes' | 'No';
  createdAt?: any;
  [key: string]: any;
};

export default function RegistrationsPage() {
  const firestore = useFirestore();
  const [filterStatus, setFilterStatus] = useState<string>("New"); // Default to 'New' for Verification Queue
  
  // Order by createdAt desc to show newest first
  const registrationsCollection = useMemoFirebase(
    () => query(collection(firestore, "registrations"), orderBy("createdAt", "desc")), 
    [firestore]
  );
  
  const { data: registrations, isLoading } = useCollection<Registration>(registrationsCollection);

  const processedData = useMemo(() => {
    if (!registrations) return [];
    
    return registrations.map(reg => ({
        ...reg,
        id: reg.id,
        name: reg.name,
        contactNo: reg.contactNo,
        wantsToHost: reg.wantsToHost || 'No',
        createdAt: reg.createdAt,
        status: reg.status || "New",
        note: reg.isMainApplicant ? '' : 'Additional Applicant',
    } as ApplicantRow));
  }, [registrations]);

  const filteredData = useMemo(() => {
    if (filterStatus === "All") return processedData;
    return processedData.filter(item => item.status === filterStatus);
  }, [processedData, filterStatus]);

  const handleExport = () => {
    if (filteredData) {
      exportToCsv(filteredData, `registrations-${filterStatus}.csv`);
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">User Management</h1>
          <p className="text-muted-foreground">
            Manage student registrations and verification queue.
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
                  Add Registration
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                      <DialogTitle>New Beneficiary Registration</DialogTitle>
                      <DialogDescription>
                          Fill in the details below to submit a new registration.
                      </DialogDescription>
                  </DialogHeader>
                  <BeneficiaryRegistrationForm />
              </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="New" onValueChange={setFilterStatus} className="w-full">
        <TabsList>
          <TabsTrigger value="New">Verification Queue (New)</TabsTrigger>
          <TabsTrigger value="Verified">Verified Students</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
          <TabsTrigger value="All">All Registrations</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{filterStatus === 'All' ? 'All Registrations' : `${filterStatus} Registrations`}</CardTitle>
            <CardDescription>
              {filterStatus === 'New' 
                ? "Review and verify new student applications." 
                : `Viewing ${filterStatus.toLowerCase()} registrations.`}
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
