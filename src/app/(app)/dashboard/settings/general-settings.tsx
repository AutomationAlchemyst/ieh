"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

const formSchema = z.object({
  semesterStart: z.string(),
  taxRate: z.string(),
  registrationFee: z.string(),
});

export function GeneralSettings() {
  const firestore = useFirestore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      semesterStart: "2025-01-01",
      taxRate: "9",
      registrationFee: "50",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    // In a real app, these would be separate documents or a single settings document
    // For now, we simulate saving to a 'system_config' document
    await setDoc(doc(firestore, "settings", "system_config"), values, { merge: true });

    toast({
      title: "Settings Updated",
      description: "System configuration has been saved.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>Manage global variables and logic.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="semesterStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Semester Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used for automated course scheduling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="registrationFee"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Registration Fee ($)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
