"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export type Payment = {
  id: string;
  bursaryId: string;
  recipientName?: string; // Optional, might need to fetch or store denormalized
  amount: number;
  date: { seconds: number; nanoseconds: number; };
  status: "Pending" | "Paid" | "Failed";
}

const PaymentActionsCell = ({ row }: { row: Payment }) => {
  const firestore = useFirestore();

  const handleStatusUpdate = async (newStatus: Payment['status']) => {
    if (!firestore) return;

    try {
      const docRef = doc(firestore, "payments", row.id);
      await updateDoc(docRef, {
        status: newStatus
      });
      toast({
        title: "Payment Updated",
        description: `Payment has been marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating the payment status.",
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
        <DropdownMenuItem onClick={() => handleStatusUpdate("Paid")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate("Failed")}>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Mark as Failed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Payment Ref",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.substring(0, 8)}...</span>
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
    }
  },
  {
    accessorKey: "date",
    header: "Scheduled Date",
    cell: ({ row }) => {
      const timestamp = row.original.date;
      if (!timestamp) return <span>-</span>;
      const date = new Date(timestamp.seconds * 1000);
      return <span>{format(date, 'PP')}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      
      if (status === "Paid") variant = "default";
      if (status === "Failed") variant = "destructive";
      if (status === "Pending") variant = "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <PaymentActionsCell row={row.original} />
  },
]
