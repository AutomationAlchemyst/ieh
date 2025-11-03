"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { serverTimestamp, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/data";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useFirestore, addDocumentNonBlocking, useUser } from "@/firebase";

const availableDays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
  { id: "everyday", label: "Everyday" },
];

const preferredTimeslots = [
  { id: "morning1", label: "Morning (8am - 10am)" },
  { id: "morning2", label: "Morning (10am - 12pm)" },
  { id: "afternoon1", label: "Afternoon (12pm - 2pm)" },
  { id: "afternoon2", label: "Afternoon (2pm - 4pm)" },
  { id: "afternoon3", label: "Afternoon (4pm - 6pm)" },
  { id: "evening1", label: "Evening (6pm - 8pm)" },
  { id: "evening2", label: "Evening (8pm - 10pm)" },
];

const referralSources = [
  "MTFA Social Media",
  "PERGAS",
  "Word-of-Mouth",
  "Other",
];

const preferredAudiences = [
    { id: "children", label: "Children (below 13 years old)" },
    { id: "youths", label: "Youths (13 - 18 years old)" },
    { id: "female_adults", label: "Female Adults" },
    { id: "male_adults", label: "Male Adults" },
];

const preferredSyllabi = [
    { id: "ars_tier1", label: "Basic Islamic Knowledge (ARS Tier 1)" },
    { id: "ars_tier2", label: "Quran Reading (ARS Tier 2)" },
    { id: "ars_tier1_2", label: "Basic Islamic Knowledge & Quran Reading (ARS Tier 1)" },
];


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["admin", "management", "teacher", "student"], {
    required_error: "Please select a role.",
  }),
  // Asatizah specific fields
  contactNo: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  location1: z.string().optional(),
  location2: z.string().optional(),
  location3: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
  preferredTimeslots: z.array(z.string()).optional(),
  referralSource: z.string().optional(),
  preferredAudience: z.array(z.string()).optional(),
  preferredSyllabus: z.array(z.string()).optional(),
  canTeachSpecialNeeds: z.enum(["Yes", "No"]).optional(),
  payNow: z.string().optional(),
});


export function AddUserForm({ defaultRole }: { defaultRole?: UserRole }) {
  const router = useRouter();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: defaultRole,
      availableDays: [],
      preferredTimeslots: [],
      preferredAudience: [],
      preferredSyllabus: [],
    },
  });

  const isAsatizahForm = defaultRole === "teacher";

    const { user } = useUser();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a user. Please log in and try again.",
        });
        return;
    }
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not available. Please try again later.",
        });
        return;
    }
    const usersCollection = collection(firestore, 'users');

    const newUser = {
      name: values.name,
      email: values.email,
      role: values.role as UserRole,
      avatar: `https://picsum.photos/seed/avatar${Math.random()}/100/100`,
      createdAt: serverTimestamp(),
      status: "Active",
      contactNo: values.contactNo,
      gender: values.gender,
      preferredLocations: [values.location1, values.location2, values.location3].filter(Boolean) as string[],
      availableDays: values.availableDays,
      preferredTimeslots: values.preferredTimeslots,
      referralSource: values.referralSource,
      preferredAudience: values.preferredAudience,
      preferredSyllabus: values.preferredSyllabus,
      canTeachSpecialNeeds: values.canTeachSpecialNeeds,
      payNow: values.payNow,
    };
    
    addDocumentNonBlocking(usersCollection, newUser);

    toast({
      title: "User Created!",
      description: `The user "${values.name}" has been successfully added.`,
    });

    router.refresh();
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[80vh] overflow-y-auto px-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (as per NRIC)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g., john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="contactNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact No.</FormLabel>
                <FormControl>
                  <Input placeholder="+65 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {isAsatizahForm && (
          <>
            <Separator />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>3 Preferred Locations</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <FormField control={form.control} name="location1" render={({ field }) => (<FormItem><FormControl><Input placeholder="Location 1" {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="location2" render={({ field }) => (<FormItem><FormControl><Input placeholder="Location 2" {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="location3" render={({ field }) => (<FormItem><FormControl><Input placeholder="Location 3" {...field} /></FormControl></FormItem>)} />
              </div>
            </div>
            <FormField
              control={form.control}
              name="availableDays"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Available Days</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableDays.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="availableDays"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredTimeslots"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Preferred Timeslots</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferredTimeslots.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="preferredTimeslots"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="preferredAudience"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Preferred Audience (Student Age Group)</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferredAudiences.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="preferredAudience"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredSyllabus"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Preferred Syllabus</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                  {preferredSyllabi.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="preferredSyllabus"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="canTeachSpecialNeeds"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Able to teach special needs class?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="No" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="payNow"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>PayNow Payment Details</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., UEN or mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {referralSources.map(source => (
                         <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
          </>
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className={isAsatizahForm ? "hidden" : ""}>
              <FormLabel>Assign Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create User
        </Button>
      </form>
    </Form>
  );
}
