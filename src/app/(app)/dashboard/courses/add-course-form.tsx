
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users, courses } from "@/lib/data";
import { useRouter } from "next/navigation";

const teachers = users.filter((u) => u.role === "teacher");

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  teacherId: z.string({
    required_error: "Please select a teacher.",
  }),
});

export function AddCourseForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd send this to your API.
    // For this demo, we'll just add it to the mock data.
    const newCourse = {
        id: `C${String(courses.length + 1).padStart(3, '0')}`,
        title: values.title,
        description: values.description,
        teacherId: values.teacherId,
        thumbnail: `https://picsum.photos/seed/course${courses.length + 1}/600/400`,
        modules: [],
        studentIds: [],
    };
    
    // This is a mock update. In a real app, you'd handle state properly.
    courses.push(newCourse);

    toast({
      title: "Course Created!",
      description: `The course "${values.title}" has been successfully created.`,
    });

    // In a real app, you would likely invalidate a query cache here
    // to refetch the courses. For the demo, we'll refresh the page.
    router.refresh();
    
    // We could also close the dialog here, but we'll let the user do it manually.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Islamic Jurisprudence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of what the course is about."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Teacher</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Create Course</Button>
      </form>
    </Form>
  );
}
