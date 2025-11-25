"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export type BursaryApplication = {
  id: string;
  applicantName: string;
  applicantId: string;
  submissionDate: { seconds: number; nanoseconds: number; };
  status: "Pending" | "Verified" | "Approved" | "Rejected";
  details: {
    householdIncome: number;
    dependents: number;
    reason: string;
  };
}

const ActionsCell = ({ row }: { row: BursaryApplication }) => {
  const firestore = useFirestore();

  const handleStatusUpdate = async (newStatus: BursaryApplication['status']) => {
    if (!firestore) return;

    try {
      const docRef = doc(firestore, "bursaries", row.id);
      await updateDoc(docRef, {
        status: newStatus
      });
      toast({
        title: "Status Updated",
        description: `Application for ${row.applicantName} has been marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating the application status.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleStatusUpdate("Verified")}>
          <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
          Mark as Verified
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate("Approved")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate("Rejected")}>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BursaryApplication>[] = [
  {
    accessorKey: "applicantName",
    header: "Applicant",
  },
  {
    accessorKey: "details.householdIncome",
    header: "Income ($)",
    cell: ({ row }) => {
        const amount = parseFloat(row.original.details?.householdIncome as any) || 0;
        return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      
      if (status === "Approved") variant = "default";
      if (status === "Verified") variant = "secondary";
      if (status === "Rejected") variant = "destructive";
      if (status === "Pending") variant = "outline";

      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  {
    accessorKey: "submissionDate",
    header: "Submitted On",
    cell: ({ row }) => {
      const timestamp = row.original.submissionDate;
      if (!timestamp) return <span>-</span>;
      const date = new Date(timestamp.seconds * 1000);
      return <span>{format(date, 'PP')}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row.original} />
  },
]
