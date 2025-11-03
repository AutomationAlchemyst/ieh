import { notFound, useParams } from "next/navigation";
import {
  getGroupById,
  getUserById,
  users as allUsers,
} from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GroupDetailsPage() {
  const params = useParams();
  const groupId = params.id as string;
  const group = getGroupById(groupId);

  if (!group) {
    notFound();
  }

  const teacher = getUserById(group.teacherId);
  const students = allUsers.filter((u) => group.studentIds.includes(u.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">{group.name}</h1>
        <p className="text-muted-foreground">Details for your Ulumi group.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Enrolled Students</CardTitle>
                    <CardDescription>The list of students in this group.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center gap-4 rounded-md border p-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Group Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <h3 className="font-semibold">Asatizah (Teacher)</h3>
                            <p className="text-muted-foreground">{teacher?.name || 'N/A'}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <h3 className="font-semibold">Meeting Location</h3>
                            <p className="text-muted-foreground">{group.location}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
