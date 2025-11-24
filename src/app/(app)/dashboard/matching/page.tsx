"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Users, MapPin, Calendar, UserCheck, Loader2 } from "lucide-react";
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
import { findMatches, MatchResult } from "@/services/matching";
import { Badge } from "@/components/ui/badge";

const students = users.filter((u) => u.role === "student");

export default function MatchingPage() {
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [locationPreferences, setLocationPreferences] = useState<string[]>([]);
  const [availabilityPreferences, setAvailabilityPreferences] = useState<string[]>([]);
  
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const togglePreference = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleFindMatches = async () => {
    setStep(3);
    setIsMatching(true);
    try {
        const results = await findMatches({
            location: locationPreferences,
            availability: availabilityPreferences
        });
        setMatchResults(results);
    } catch (error) {
        console.error("Matching failed", error);
    } finally {
        setIsMatching(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline md:text-4xl">
          Student-Asatizah Matching
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Follow the steps to automatically match students with a suitable teacher using our AI-powered engine.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Progress value={progress} className="mb-8" />
        <Card className="shadow-lg min-h-[500px] flex flex-col">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><Users /> Select Students</CardTitle>
                <CardDescription>
                  Choose one or more students to be matched.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto p-2 sm:p-4 flex-1">
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
              <CardFooter className="justify-end mt-auto">
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
              <CardContent className="space-y-6 flex-1">
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" /> Location Preference</Label>
                    <div className="flex flex-wrap gap-2">
                        {["East", "West", "North", "South", "Central"].map((loc) => (
                            <Button 
                                key={loc}
                                variant={locationPreferences.includes(loc) ? "default" : "outline"}
                                onClick={() => togglePreference(loc, locationPreferences, setLocationPreferences)}
                                size="sm"
                            >
                                {loc}
                            </Button>
                        ))}
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4" /> Availability</Label>
                    <div className="flex flex-wrap gap-2">
                         {["Weekdays", "Weekends", "Evenings"].map((day) => (
                            <Button 
                                key={day}
                                variant={availabilityPreferences.includes(day) ? "default" : "outline"}
                                onClick={() => togglePreference(day, availabilityPreferences, setAvailabilityPreferences)}
                                size="sm"
                            >
                                {day}
                            </Button>
                        ))}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between mt-auto">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleFindMatches} disabled={locationPreferences.length === 0 && availabilityPreferences.length === 0}>
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
                  We analyzed your criteria against our teacher database.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto p-2 sm:p-4 flex-1">
                {isMatching ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Consulting AI Knowledge Base...</p>
                    </div>
                ) : matchResults.length > 0 ? (
                    matchResults.map(({ teacher, score, reasoning }) => (
                    <div
                        key={teacher.id}
                        className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${selectedTeacherId === teacher.id ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                        onClick={() => setSelectedTeacherId(teacher.id)}
                    >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 sm:hidden">
                                <div className="font-bold">{teacher.name}</div>
                                <Badge variant={score >= 80 ? "default" : "secondary"}>{score}% Match</Badge>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-1">
                            <div className="hidden sm:flex items-center justify-between">
                                <div className="font-bold text-lg">{teacher.name}</div>
                                <Badge variant={score >= 80 ? "default" : "secondary"}>{score}% Match</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {reasoning}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {teacher.preferredLocations?.map(l => <Badge key={l} variant="outline" className="text-xs">{l}</Badge>)}
                                {teacher.availableDays?.map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}
                            </div>
                        </div>
                        
                        {selectedTeacherId === teacher.id && (
                            <div className="absolute top-4 right-4 sm:static sm:block">
                                <CheckCircle className="h-6 w-6 text-primary"/>
                            </div>
                        )}
                    </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No teachers found matching your criteria. Try adjusting your filters.
                    </div>
                )}
              </CardContent>
              <CardFooter className="justify-between mt-auto">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} disabled={!selectedTeacherId}>
                  Confirm Match <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          {step === 4 && (
             <>
              <CardHeader className="items-center text-center flex-1 justify-center">
                 <div className="rounded-full bg-green-100 p-6 mb-4">
                     <CheckCircle className="h-16 w-16 text-green-600" />
                 </div>
                <CardTitle className="text-3xl text-green-800">Match Confirmed!</CardTitle>
                <CardDescription className="text-lg mt-2 max-w-md">
                  The students and teacher have been notified. A new <span className="font-semibold text-foreground">Ulumi Group</span> has been created successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-12">
                <Button size="lg" onClick={() => { 
                    setStep(1); 
                    setSelectedStudents([]); 
                    setSelectedTeacherId(null);
                    setLocationPreferences([]);
                    setAvailabilityPreferences([]);
                }}>
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