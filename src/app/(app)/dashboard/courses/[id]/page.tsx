"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft, Edit, Plus, Trash, ArrowUp, ArrowDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCourseById, getCurrentUser, getUserById, CourseModule } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ModuleManager = ({ initialModules }: { initialModules: CourseModule[] }) => {
  const [modules, setModules] = useState(initialModules);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const addModule = () => {
    if (newModuleTitle.trim() === "") return;
    const newModule: CourseModule = {
      id: `M${modules.length + 1}`,
      title: newModuleTitle.trim(),
      content: "Newly added module content. Please edit.",
    };
    setModules([...modules, newModule]);
    setNewModuleTitle("");
  };
  
  const deleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  }

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const newModules = [...modules];
    const item = newModules[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    newModules[index] = newModules[swapIndex];
    newModules[swapIndex] = item;
    setModules(newModules);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Modules</CardTitle>
        <CardDescription>Add, edit, reorder, and delete modules for this course.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {modules.map((module, index) => (
            <AccordionItem value={module.id} key={module.id}>
              <div className="flex items-center gap-2 group">
                 <div className="flex flex-col">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveModule(index, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                 </div>
                <AccordionTrigger className="flex-1 text-left">{module.title}</AccordionTrigger>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pr-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4"/>
                    </Button>
                     <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => deleteModule(module.id)}>
                        <Trash className="h-4 w-4"/>
                    </Button>
                </div>
              </div>
              <AccordionContent className="pl-12">
                <Textarea defaultValue={module.content} className="min-h-[100px]" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Input 
                placeholder="New module title"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="flex-grow"
            />
            <Button onClick={addModule} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Module
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ModuleViewer = ({ modules }: { modules: CourseModule[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>Course Modules</CardTitle>
        <CardDescription>An overview of the topics covered in this course.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {modules.map((module) => (
            <AccordionItem value={module.id} key={module.id}>
              <AccordionTrigger className="text-left">{module.title}</AccordionTrigger>
              <AccordionContent>{module.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );


export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = getCourseById(courseId);
  const currentUser = getCurrentUser();

  if (!course) {
    notFound();
  }

  const teacher = getUserById(course.teacherId);
  const canEdit = currentUser.role === "admin" || currentUser.id === course.teacherId;

  return (
    <div className="space-y-8">
        <div>
            <Button variant="outline" asChild>
                <Link href="/dashboard/courses">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Courses
                </Link>
            </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="font-medium">{teacher?.name || 'N/A'}</span>
                </div>
            </div>
            <div className="md:col-span-1">
                <Image 
                    src={course.thumbnail}
                    alt={course.title}
                    width={600}
                    height={400}
                    data-ai-hint="education learning"
                    className="rounded-lg shadow-md aspect-video object-cover"
                />
            </div>
        </div>

        <div>
            {canEdit ? <ModuleManager initialModules={course.modules} /> : <ModuleViewer modules={course.modules} />}
        </div>
    </div>
  );
}
