"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';

// This type represents a single row in our applicants table, which can be either a main applicant or an additional one.
export type ApplicantRow = {
  id: string;
  name: string;
  contactNo?: string;
  wantsToHost: 'Yes' | 'No';
  createdAt: { seconds: number; nanoseconds: number; };
  status: string;
  note?: string; // To indicate if it's an additional applicant
}

export const columns: ColumnDef<ApplicantRow>[] = [
  {
    accessorKey: "name",
    header: "Applicant",
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
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "status",
    header: "Status",
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
