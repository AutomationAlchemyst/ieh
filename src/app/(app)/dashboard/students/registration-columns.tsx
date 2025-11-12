"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';

// This is a new data type representing a document from the 'registrations' collection
// It will be different from the old 'User' type.
export type Applicant = {
  name: string;
  ageGroup: string;
  preferredSubject: string;
};

export type Registration = {
  id: string;
  name: string;
  contactNo?: string;
  wantsToHost: 'Yes' | 'No';
  createdAt: { seconds: number; nanoseconds: number; };
  additionalApplicants?: Applicant[];
  status: string;
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
      const additionalApplicants = row.original.additionalApplicants;
      if (!additionalApplicants || additionalApplicants.length === 0) {
        return <span>0</span>;
      }
      return (
        <ul className="list-disc list-inside">
          {additionalApplicants.map((applicant, index) => (
            <li key={index}>
              <strong>{applicant.name}</strong> ({applicant.ageGroup}) - {applicant.preferredSubject}
            </li>
          ))}
        </ul>
      );
    }
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
