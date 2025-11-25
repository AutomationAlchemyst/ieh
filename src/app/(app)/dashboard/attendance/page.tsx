"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, Clock, XCircle } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import type { User } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, "Present" | "Absent" | "Late">>({});

  // 1. Fetch Groups assigned to this teacher (or all if admin, but let's stick to teacher view)
  const groupsCollection = useMemoFirebase(() => collection(firestore, "ulumi_groups"), [firestore]);
  // If user is admin, show all? For now, let's assume this view is primarily for the person conducting the class.
  // We'll fallback to showing all groups if the user is an Admin, or only theirs if Teacher.
  // Since we don't have the user role handy in this hook without fetching profile, let's just query by asatizahId if user exists.
  // Ideally, we check role. For this prototype, if you created the group via matching, you are the teacher.
  
  // Note: In the matching flow, we assigned the teacherId. If I am the admin testing this, I might not be the teacher.
  // To make it easy to test: If I am 'admin', I should probably see ALL groups. 
  // Let's just fetch ALL groups for now to ensure visibility during demo, filtering client side if needed.
  const groupsQuery = useMemoFirebase(() => query(groupsCollection, orderBy("createdAt", "desc")), [groupsCollection]);
  const { data: allGroups, isLoading: groupsLoading } = useCollection<any>(groupsQuery);

  const teacherGroups = useMemo(() => {
      if (!allGroups || !user) return [];
      // Filter: If I am the assigned teacher OR if I'm just an admin viewing this (assuming admin can see all)
      // For demo simplicity: Show ALL groups so you can test it easily without logging in as specific teacher
      return allGroups; 
  }, [allGroups, user]);

  // 2. Fetch Students to display names
  const usersCollection = useMemoFirebase(() => collection(firestore, "users"), [firestore]);
  const { data: allUsers } = useCollection<User>(usersCollection);

  const selectedGroup = teacherGroups.find((g: any) => g.id === selectedGroupId);
  
  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late") => {
      setAttendanceStatus(prev => ({
          ...prev,
          [studentId]: status
      }));
  };

  const handleSubmit = () => {
      if (!firestore || !user || !selectedGroupId || !date) {
          toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." });
          return;
      }

      const attendanceCollection = collection(firestore, 'attendance_logs');
      const payoutCollection = collection(firestore, 'payments');

      const logData = {
          groupId: selectedGroupId,
          groupName: selectedGroup?.name,
          teacherId: user.uid,
          date: date,
          status: attendanceStatus,
          remarks: remarks,
          createdAt: serverTimestamp(),
      };

      // 1. Log Attendance
      addDocumentNonBlocking(attendanceCollection, logData);

      // 2. Trigger Payout Logic (Automated $50 per class)
      const payoutData = {
          recipientId: user.uid,
          recipientName: user.displayName || "Teacher",
          amount: 50,
          currency: "SGD",
          reason: `Class conducted on ${format(date, 'yyyy-MM-dd')} for ${selectedGroup?.name}`,
          status: "Pending",
          date: serverTimestamp(),
          source: "attendance_log",
          referenceId: "generated_id"
      };
      
      addDocumentNonBlocking(payoutCollection, payoutData);

      toast({
          title: "Attendance Submitted",
          description: "Class log saved and payout request generated.",
      });

      // Reset form
      setRemarks("");
      setAttendanceStatus({});
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Class Attendance</h1>
        <p className="text-muted-foreground">
          Log your sessions to ensure accurate student tracking and timely payouts.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Select the group and date of the class.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Group</label>
                {groupsLoading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Select onValueChange={setSelectedGroupId} value={selectedGroupId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a group..." />
                        </SelectTrigger>
                        <SelectContent>
                            {teacherGroups.length > 0 ? (
                                teacherGroups.map((group: any) => (
                                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-muted-foreground">No active groups found.</div>
                            )}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Remarks / Lesson Log</label>
                <Textarea 
                    placeholder="Briefly describe what was covered today..." 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>Mark the status for each student in the group.</CardDescription>
          </CardHeader>
          <CardContent>
              {!selectedGroupId ? (
                  <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
                      Select a group to view students
                  </div>
              ) : (
                  <div className="space-y-4">
                      {selectedGroup?.studentIds?.map((studentId: string, index: number) => {
                          const student = allUsers?.find(u => u.id === studentId);
                          const studentName = student?.name || `Student (ID: ${studentId.substring(0, 5)}...)`; 
                          
                          return (
                            <div key={studentId} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {studentName.charAt(0)}
                                    </div>
                                    <span className="font-medium">{studentName}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        size="sm" 
                                        variant={attendanceStatus[studentId] === "Present" ? "default" : "outline"}
                                        className={cn(attendanceStatus[studentId] === "Present" && "bg-green-600 hover:bg-green-700")}
                                        onClick={() => handleStatusChange(studentId, "Present")}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant={attendanceStatus[studentId] === "Late" ? "default" : "outline"}
                                        className={cn(attendanceStatus[studentId] === "Late" && "bg-yellow-600 hover:bg-yellow-700")}
                                        onClick={() => handleStatusChange(studentId, "Late")}
                                    >
                                        <Clock className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant={attendanceStatus[studentId] === "Absent" ? "default" : "outline"}
                                        className={cn(attendanceStatus[studentId] === "Absent" && "bg-red-600 hover:bg-red-700")}
                                        onClick={() => handleStatusChange(studentId, "Absent")}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                          )
                      })}
                  </div>
              )}
          </CardContent>
          <CardFooter>
              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!selectedGroupId || !date}>
                  Submit Attendance Log
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
