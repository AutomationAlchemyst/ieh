"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Users, MapPin, Calendar, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { users } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const students = users.filter((u) => u.role === "student");
const teachers = users.filter((u) => u.role === "teacher");

export default function MatchingPage() {
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const progress = (step / 4) * 100;

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline md:text-4xl">
          Student-Asatizah Matching
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Follow the steps to automatically match students with a suitable teacher.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Progress value={progress} className="mb-8" />
        <Card className="shadow-lg">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><Users /> Select Students</CardTitle>
                <CardDescription>
                  Choose one or more students to be matched.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto p-2 sm:p-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentSelect(student.id)}
                    />
                    <Label
                      htmlFor={`student-${student.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </Label>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={() => setStep(2)} disabled={selectedStudents.length === 0}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><MapPin /> Define Criteria</CardTitle>
                <CardDescription>
                  Set the location and availability preferences for this group.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location Preference</Label>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline">East</Button>
                        <Button variant="outline">West</Button>
                        <Button variant="outline">North</Button>
                        <Button variant="outline">Central</Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Availability</Label>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline">Weekdays</Button>
                        <Button variant="outline">Weekends</Button>
                        <Button variant="outline">Evenings</Button>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><UserCheck /> Select a Teacher (Asatizah)</CardTitle>
                <CardDescription>
                  We found these teachers based on your criteria. Choose one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto p-2 sm:p-4">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${selectedTeacher === teacher.id ? 'bg-accent/20 border-accent' : 'hover:bg-muted/50'}`}
                    onClick={() => setSelectedTeacher(teacher.id)}
                  >
                    <Avatar>
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">80% Match Score</div>
                    </div>
                    {selectedTeacher === teacher.id && <CheckCircle className="h-6 w-6 text-accent"/>}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} disabled={!selectedTeacher}>
                  Confirm Match <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          {step === 4 && (
             <>
              <CardHeader className="items-center text-center">
                 <CheckCircle className="h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl">Match Confirmed!</CardTitle>
                <CardDescription>
                  The students and teacher have been notified and a new Ulumi Group has been created.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => { setStep(1); setSelectedStudents([]); setSelectedTeacher(null); }}>
                    Create Another Match
                </Button>
              </CardContent>
             </>
          )}

        </Card>
      </div>
    </div>
  );
}
