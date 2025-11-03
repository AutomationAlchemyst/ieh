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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const applicantSchema = z.object({
  name: z.string().min(2, { message: "Applicant name must be at least 2 characters." }),
  ageGroup: z.enum(["Child (below 13 years old)", "Youth (13-18 years old)", "Female Adult", "Male Adult"]),
  preferredSubject: z.enum(["Basic Islamic Knowledge", "Quran Reading", "Both"]),
  preferredDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  preferredTimeSlot: z.enum(["Morning (8am - 10am)", "Morning (10am - 12pm)", "Afternoon (12pm - 2pm)", "Afternoon (2pm - 4pm)", "Afternoon (4pm - 6pm)", "Evening (6pm - 8pm)", "Evening (8pm - 10pm)"]),
});

const formSchema = z.object({
  // Main Applicant
  name: z.string().min(2, { message: "Main applicant's name must be at least 2 characters." }),
  contactNo: z.string().min(8, { message: "Please enter a valid mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  homeAddress: z.string().min(5, { message: "Please enter a valid home address." }),
  
  // Hosting
  wantsToHost: z.enum(["Yes", "No"], { required_error: "Please select if you would like to be a host." }),
  paymentMethod: z.enum(["PayNow", "Bank Account"]).optional(),
  paymentDetails: z.string().optional(),

  // Main Applicant's Preferences
  ageGroup: z.enum(["Child (below 13 years old)", "Youth (13-18 years old)", "Female Adult", "Male Adult"], { required_error: "Please select an age group for the main applicant." }),
  preferredSubject: z.enum(["Basic Islamic Knowledge", "Quran Reading", "Both"], { required_error: "Please select a subject for the main applicant." }),
  preferredDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], { required_error: "Please select a day for the main applicant." }),
  preferredTimeSlot: z.enum(["Morning (8am - 10am)", "Morning (10am - 12pm)", "Afternoon (12pm - 2pm)", "Afternoon (2pm - 4pm)", "Afternoon (4pm - 6pm)", "Evening (6pm - 8pm)", "Evening (8pm - 10pm)"], { required_error: "Please select a time slot for the main applicant." }),

  // Additional Applicants
  registeringApplicant2: z.boolean().default(false),
  applicant2: applicantSchema.optional(),
  registeringApplicant3: z.boolean().default(false),
  applicant3: applicantSchema.optional(),
  registeringApplicant4: z.boolean().default(false),
  applicant4: applicantSchema.optional(),
  registeringApplicant5: z.boolean().default(false),
  applicant5: applicantSchema.optional(),

  // Consents
  mediaConsent: z.boolean().refine(val => val === true, { message: "You must consent to the media recording and publicity terms." }),
  pdpaConsent: z.boolean().refine(val => val === true, { message: "You must consent to the PDPA terms." }),
})
.refine(data => !data.registeringApplicant2 || (data.registeringApplicant2 && data.applicant2), {
  message: "Applicant 2 details are required.",
  path: ["applicant2"],
})
.refine(data => !data.registeringApplicant3 || (data.registeringApplicant3 && data.applicant3), {
  message: "Applicant 3 details are required.",
  path: ["applicant3"],
})
.refine(data => !data.registeringApplicant4 || (data.registeringApplicant4 && data.applicant4), {
  message: "Applicant 4 details are required.",
  path: ["applicant4"],
})
.refine(data => !data.registeringApplicant5 || (data.registeringApplicant5 && data.applicant5), {
  message: "Applicant 5 details are required.",
  path: ["applicant5"],
});

export function BeneficiaryRegistrationForm() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registeringApplicant2: false,
      registeringApplicant3: false,
      registeringApplicant4: false,
      registeringApplicant5: false,
      mediaConsent: false,
      pdpaConsent: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit this form. Please try again.",
      });
      return;
    }

    const registrationsCollection = collection(firestore, 'registrations');

    const additionalApplicants = [];
    if (values.registeringApplicant2 && values.applicant2) additionalApplicants.push(values.applicant2);
    if (values.registeringApplicant3 && values.applicant3) additionalApplicants.push(values.applicant3);
    if (values.registeringApplicant4 && values.applicant4) additionalApplicants.push(values.applicant4);
    if (values.registeringApplicant5 && values.applicant5) additionalApplicants.push(values.applicant5);

        const newRegistration: any = {
      // Main Applicant Info
      name: values.name,
      email: values.email,
      contactNo: values.contactNo,
      homeAddress: values.homeAddress,
      
      // Hosting Info
      wantsToHost: values.wantsToHost,

      // Main Applicant Preferences
      ageGroup: values.ageGroup,
      preferredSubject: values.preferredSubject,
      preferredDay: values.preferredDay,
      preferredTimeSlot: values.preferredTimeSlot,

      // Additional Applicants
      additionalApplicants: additionalApplicants,

      // Consents
      mediaConsent: values.mediaConsent,
      pdpaConsent: values.pdpaConsent,

      // System fields
      submittedBy: user.uid,
      createdAt: serverTimestamp(),
      status: "New" as const,
    };

    if (newRegistration.wantsToHost === 'Yes') {
      newRegistration.paymentMethod = values.paymentMethod;
      newRegistration.paymentDetails = values.paymentDetails;
    }

    addDocumentNonBlocking(registrationsCollection, newRegistration);

    toast({
      title: "Registration Submitted!",
      description: `The registration for "${values.name}" has been successfully submitted.`,
    });

    router.refresh();
    form.reset();
  }

    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 max-h-[80vh] overflow-y-auto px-2">
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Main Applicant Details</h3>
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>1. Main Applicant’s FULL NAME</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactNo" render={({ field }) => (<FormItem><FormLabel>2. MOBILE NO.</FormLabel><FormControl><Input placeholder="+65 1234 5678" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>3. EMAIL ADDRESS</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="homeAddress" render={({ field }) => (<FormItem><FormLabel>4. HOME ADDRESS</FormLabel><FormControl><Input placeholder="e.g., 123 Ang Mo Kio Ave 4, #05-67, Singapore 560123" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Enrich Our Community by Hosting a Class at Your Home</h3>
          <p className="text-sm text-muted-foreground">Welcome the spirit of learning into your home. By hosting a weekly class, you help foster growth, connection, and community. All from the comfort of your own space. Hosts of our weekly classes will receive a monthly token of appreciation of $50, along with $10 per session to cover refreshments.</p>
          <FormField
            control={form.control}
            name="wantsToHost"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>5. I would like to be a host</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('wantsToHost') === 'Yes' && (
            <div className="space-y-4 pl-4 pt-4 border-l">
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (<FormItem><FormLabel>6. Choose Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a payment method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PayNow">PayNow</SelectItem><SelectItem value="Bank Account">Bank Account</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="paymentDetails" render={({ field }) => (<FormItem><FormLabel>7. Payment Details</FormLabel><FormControl><Input placeholder="PayNow number / Bank Account number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-semibold mb-4">Class Preferences (Main Applicant)</h3>
          <FormField control={form.control} name="ageGroup" render={({ field }) => (<FormItem><FormLabel>8. Main Applicant’s Age Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger></FormControl><SelectContent>{["Child (below 13 years old)", "Youth (13-18 years old)", "Female Adult", "Male Adult"].map(age => <SelectItem key={age} value={age}>{age}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="preferredSubject" render={({ field }) => (<FormItem><FormLabel>9. Preferred Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl><SelectContent>{["Basic Islamic Knowledge", "Quran Reading", "Both"].map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="preferredDay" render={({ field }) => (<FormItem><FormLabel>10. Preferred Day</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger></FormControl><SelectContent>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="preferredTimeSlot" render={({ field }) => (<FormItem><FormLabel>11. Preferred Time Slot</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger></FormControl><SelectContent>{["Morning (8am - 10am)", "Morning (10am - 12pm)", "Afternoon (12pm - 2pm)", "Afternoon (2pm - 4pm)", "Afternoon (4pm - 6pm)", "Evening (6pm - 8pm)", "Evening (8pm - 10pm)"].map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
        </div>

        {[2, 3, 4, 5].map(num => (
          <div key={num} className="p-4 border rounded-lg space-y-4">
            <FormField
              control={form.control}
              name={`registeringApplicant${num}` as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>{11 + num - 1}. Would you like to register for Applicant {num}?</FormLabel>
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />
            {form.watch(`registeringApplicant${num}` as any) && (
              <div className="space-y-4 pl-4 pt-4 border-l">
                <FormField control={form.control} name={`applicant${num}.name` as any} render={({ field }) => (<FormItem><FormLabel>Applicant {num}'s FULL NAME</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`applicant${num}.ageGroup` as any} render={({ field }) => (<FormItem><FormLabel>Applicant {num}'s Age Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger></FormControl><SelectContent>{["Child (below 13 years old)", "Youth (13-18 years old)", "Female Adult", "Male Adult"].map(age => <SelectItem key={age} value={age}>{age}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`applicant${num}.preferredSubject` as any} render={({ field }) => (<FormItem><FormLabel>Applicant {num}'s Preferred Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl><SelectContent>{["Basic Islamic Knowledge", "Quran Reading", "Both"].map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`applicant${num}.preferredDay` as any} render={({ field }) => (<FormItem><FormLabel>Applicant {num}'s Preferred Day</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger></FormControl><SelectContent>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`applicant${num}.preferredTimeSlot` as any} render={({ field }) => (<FormItem><FormLabel>Applicant {num}'s Preferred Time Slot</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger></FormControl><SelectContent>{["Morning (8am - 10am)", "Morning (10am - 12pm)", "Afternoon (12pm - 2pm)", "Afternoon (2pm - 4pm)", "Afternoon (4pm - 6pm)", "Evening (6pm - 8pm)", "Evening (8pm - 10pm)"].map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
            )}
          </div>
        ))}

        <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Consents</h3>
            <FormField
                control={form.control}
                name="mediaConsent"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>16. Media Recording & Publicity Consent</FormLabel>
                            <FormDescription>Ihsan Education Hub (IEH) may conduct occasional house visits during class sessions. By participating in this program, you acknowledge and consent to the collection, use, and disclosure of your image, voice, and/or likeness (via photographs, video, or audio recordings) by MTFA & IEH for purposes of publicity, marketing, documentation, and/or training. This may include publication in MTFA & IEH’s printed materials, websites, and oƯicial social media channels.</FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pdpaConsent"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>17. PDPA Consent</FormLabel>
                            <FormDescription>By submitting this form, you hereby give your consent to Muslimin Trust Fund Association and Ihsan Education Hub to collect, use and disclose your personal data for the purposes of processing your request. For more information on our personal data protection policies and practices, you may refer to our Data Protection Privacy Policy at https://www.mtfa.org/privacy￾policy. You may withdraw your consent at any time by contacting our Data Protection OƯicer at dpo@mtfa.org.</FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        </div>

        <Button type="submit" className="w-full">
          Submit Registration
        </Button>
      </form>
    </Form>
  );
}
