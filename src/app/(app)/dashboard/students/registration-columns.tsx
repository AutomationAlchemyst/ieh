"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';

// This is a new data type representing a document from the 'registrations' collection
// It will be different from the old 'User' type.
export type Registration = {
  id: string;
  name: string;
  contactNo?: string;
  wantsToHost: 'Yes' | 'No';
  createdAt: { seconds: number; nanoseconds: number; };
  additionalApplicants?: any[];
}

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "name",
    header: "Main Applicant",
  },
  {
    accessorKey: "contactNo",
    header: "Contact No.",
  },
  {
    accessorKey: "wantsToHost",
    header: "Hosting?",
  },
  {
    accessorKey: "additionalApplicants",
    header: "Additional Applicants",
    cell: ({ row }) => {
      const count = row.original.additionalApplicants?.length || 0;
      return <span>{count}</span>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => {
      const timestamp = row.original.createdAt;
      if (!timestamp) return null;
      const date = new Date(timestamp.seconds * 1000);
      return <span>{format(date, 'PPP')}</span>;
    },
  },
]
