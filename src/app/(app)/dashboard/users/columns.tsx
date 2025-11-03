"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const user = row.original;
        const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('') : '';
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const variant: "default" | "secondary" | "outline" | "destructive" = 
            role === "admin" ? "destructive" :
            role === "management" ? "default" :
            role === "teacher" ? "secondary" : "outline";

        return <Badge variant={variant} className="capitalize">{role}</Badge>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={status === "Active" ? "default" : "secondary"} className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30">{status}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Joined Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as Timestamp | Date;
        if (!createdAt) return null;
        const date = createdAt instanceof Timestamp ? createdAt.toDate() : createdAt;
        const formatted = date.toLocaleDateString();
        return <div className="text-left">{formatted}</div>;
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="text-right">
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
                onClick={() => navigator.clipboard.writeText(user.email)}
                >
                Copy email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Edit user</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
