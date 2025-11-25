"use client";

import { useState, useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, serverTimestamp } from "firebase/firestore";
import { generateMatchesAction } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import type { User } from "@/lib/data";

export default function MatchingPage() {
  const firestore = useFirestore();
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [locationPreferences, setLocationPreferences] = useState<string[]>([]);
  const [availabilityPreferences, setAvailabilityPreferences] = useState<string[]>([]);
  
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // Fetch Students
  const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const studentsQuery = useMemoFirebase(() => query(usersCollection, where("role", "==", "student")), [usersCollection]);
  const { data: students } = useCollection<User>(studentsQuery);

  // Fetch Teachers
  const teachersQuery = useMemoFirebase(() => query(usersCollection, where("role", "==", "teacher")), [usersCollection]);
  const { data: teachers } = useCollection<User>(teachersQuery);

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
    if (!students || !teachers) return;

    setStep(3);
    setIsMatching(true);
    
    // Prepare data for AI
    const selectedStudentObjects = students.filter(s => selectedStudents.includes(s.id));
    
    try {
        // Call Server Action
        const aiResults = await generateMatchesAction(
            selectedStudentObjects, 
            teachers, 
            {
                location: locationPreferences,
                availability: availabilityPreferences
            }
        );
        
        // Merge AI scores with full teacher objects for display
        const enrichedResults = aiResults.map((result: any) => {
            const teacher = teachers.find(t => t.id === result.teacherId);
            return {
                ...result,
                teacher: teacher // Attach full teacher profile
            };
        }).filter((r: any) => r.teacher); // Filter out if teacher not found

        setMatchResults(enrichedResults);

    } catch (error) {
        console.error("Matching failed", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Failed to generate matches. Please try again.",
        });
    } finally {
        setIsMatching(false);
    }
  };

  const handleConfirmMatch = () => {
      if (!firestore || !selectedTeacherId) return;

      const matchesCollection = collection(firestore, 'matches');
      const groupsCollection = collection(firestore, 'ulumi_groups');
      
      const selectedTeacher = matchResults.find(r => r.teacherId === selectedTeacherId)?.teacher;
      const groupName = selectedTeacher ? `Class with ${selectedTeacher.name}` : "New Class Group";
      const location = locationPreferences[0] || "Main Campus"; // Default to first pref or fallback

      const matchData = {
          studentIds: selectedStudents,
          teacherId: selectedTeacherId,
          status: "approved", // Auto-approving for this flow to enable Attendance immediately
          createdAt: serverTimestamp(),
          adminCriteria: {
              location: locationPreferences,
              availability: availabilityPreferences
          }
      };

      const groupData = {
          name: groupName,
          asatizahId: selectedTeacherId,
          studentIds: selectedStudents,
          meetingLocation: location,
          createdAt: serverTimestamp(),
          status: "Active"
      };

      // 1. Create the Match Record
      addDocumentNonBlocking(matchesCollection, matchData);

      // 2. Create the Active Group (so it shows in Attendance)
      addDocumentNonBlocking(groupsCollection, groupData);

      setStep(4);
  }

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
                {students?.map((student) => (
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
                        <p className="text-muted-foreground animate-pulse">Genkit AI is analyzing profiles...</p>
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
                                {teacher.preferredLocations?.map((l: string) => <Badge key={l} variant="outline" className="text-xs">{l}</Badge>)}
                                {teacher.availableDays?.map((d: string) => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}
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
                <Button onClick={handleConfirmMatch} disabled={!selectedTeacherId}>
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
                <CardTitle className="text-3xl text-green-800">Match Proposed!</CardTitle>
                <CardDescription className="text-lg mt-2 max-w-md">
                  The match has been recorded and is now <span className="font-semibold text-foreground">Pending Approval</span>. The teacher and students will be notified once you finalize the process.
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