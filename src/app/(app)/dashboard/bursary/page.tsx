"use client";

import { useMemo, useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { DataTable } from "../users/data-table"; // Generic table
import { PlusCircle, Wallet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { BursaryApplicationForm } from "./bursary-application-form";
import { columns as appColumns, BursaryApplication } from "./columns";
import { paymentColumns, Payment } from "./payments-columns";

export default function BursaryPage() {
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);

  // Fetch Applications
  const applicationsQuery = useMemoFirebase(
    () => query(collection(firestore, "bursaries"), orderBy("submissionDate", "desc")),
    [firestore]
  );
  const { data: applications, isLoading: appsLoading } = useCollection<BursaryApplication>(applicationsQuery);

  // Fetch Payments
  const paymentsQuery = useMemoFirebase(
    () => query(collection(firestore, "payments"), orderBy("date", "desc")),
    [firestore]
  );
  const { data: payments, isLoading: paymentsLoading } = useCollection<Payment>(paymentsQuery);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Bursary Management</h1>
          <p className="text-muted-foreground">
            Manage financial aid applications and track disbursements.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>New Bursary Application</DialogTitle>
                    <DialogDescription>
                        Submit a new financial aid application on behalf of a student.
                    </DialogDescription>
                </DialogHeader>
                <BursaryApplicationForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList>
          <TabsTrigger value="applications">
             <FileText className="mr-2 h-4 w-4" /> Applications
          </TabsTrigger>
          <TabsTrigger value="payments">
             <Wallet className="mr-2 h-4 w-4" /> Payments / Disbursements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Bursary Applications</CardTitle>
              <CardDescription>All incoming requests for financial assistance.</CardDescription>
            </CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <DataTable 
                    columns={appColumns} 
                    data={applications || []} 
                    searchKey="applicantName"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>Monitor status of approved disbursements.</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <DataTable 
                    columns={paymentColumns} 
                    data={payments || []} 
                    searchKey="id" // Search by Payment ID for now
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
