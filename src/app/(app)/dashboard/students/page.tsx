
"use client";

import { useMemo } from "react";
import { collection } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { DataTable } from "../users/data-table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BeneficiaryRegistrationForm } from "./beneficiary-registration-form";
import { columns, Registration } from "./registration-columns";

export default function RegistrationsPage() {
  const firestore = useFirestore();
  const registrationsCollection = useMemoFirebase(() => collection(firestore, "registrations"), [firestore]);
  
  const { data: registrations, isLoading } = useCollection<Registration>(registrationsCollection);
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">Beneficiary Registrations</h1>
          <p className="text-muted-foreground">
            View and manage all submitted registrations.
          </p>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>A list of all submitted registrations.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={registrations || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
