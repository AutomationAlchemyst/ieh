"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { serverTimestamp, collection } from "firebase/firestore";
import { useFirestore, addDocumentNonBlocking, useUser } from "@/firebase";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  applicantName: z.string().min(2, { message: "Applicant name must be at least 2 characters." }),
  applicantId: z.string().optional(), // Optional for now, can be linked later
  householdIncome: z.coerce.number().min(0, { message: "Income must be a positive number." }),
  dependents: z.coerce.number().int().min(0),
  reason: z.string().min(10, { message: "Please provide a reason for the application." }),
});

export function BursaryApplicationForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      applicantId: "",
      householdIncome: 0,
      dependents: 0,
      reason: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit this form.",
      });
      return;
    }

    const applicationsCollection = collection(firestore, 'bursaries');

    const newApplication = {
      applicantName: values.applicantName,
      applicantId: values.applicantId || "manual_entry",
      details: {
        householdIncome: values.householdIncome,
        dependents: values.dependents,
        reason: values.reason,
      },
      submissionDate: serverTimestamp(),
      status: "Pending",
      submittedBy: user.uid,
    };

    addDocumentNonBlocking(applicationsCollection, newApplication);

    toast({
      title: "Application Submitted",
      description: `Bursary application for ${values.applicantName} has been created.`,
    });

    form.reset();
    if (onSuccess) {
      onSuccess();
    }
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        
        <FormField
          control={form.control}
          name="applicantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicant Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Student Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="householdIncome"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Monthly Household Income ($)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dependents"
            render={({ field }) => (
                <FormItem>
                <FormLabel>No. of Dependents</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Aid</FormLabel>
              <FormControl>
                <Textarea placeholder="Explain the financial situation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
