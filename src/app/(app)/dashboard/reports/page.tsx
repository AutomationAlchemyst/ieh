"use client";

import { useMemo } from "react";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// --- Mock Data Generators (until we have enough real data) ---
const monthlyRegistrations = [
  { name: "Jan", total: 12 },
  { name: "Feb", total: 18 },
  { name: "Mar", total: 25 },
  { name: "Apr", total: 30 },
  { name: "May", total: 45 },
  { name: "Jun", total: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  const firestore = useFirestore();

  // 1. Fetch Real User Data for Demographics
  const usersCollection = useMemoFirebase(() => collection(firestore, "registrations"), [firestore]);
  const { data: users } = useCollection<any>(usersCollection);

  const demographicsData = useMemo(() => {
    if (!users) return [];
    
    const ageGroups: Record<string, number> = {};
    users.forEach(u => {
      const group = u.ageGroup || "Unknown";
      ageGroups[group] = (ageGroups[group] || 0) + 1;
    });

    return Object.keys(ageGroups).map(key => ({
      name: key,
      value: ageGroups[key],
    }));
  }, [users]);

  // 2. Fetch Bursary Data for Financials
  const bursaryCollection = useMemoFirebase(() => collection(firestore, "bursaries"), [firestore]);
  const { data: bursaries } = useCollection<any>(bursaryCollection);

  const bursaryStats = useMemo(() => {
    if (!bursaries) return { approved: 0, pending: 0, rejected: 0, total: 0 };
    return {
      approved: bursaries.filter((b: any) => b.status === "Approved").length,
      pending: bursaries.filter((b: any) => b.status === "Pending").length,
      rejected: bursaries.filter((b: any) => b.status === "Rejected").length,
      total: bursaries.length
    };
  }, [bursaries]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Key metrics on user growth, demographics, and financial aid.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bursary Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bursaryStats.total}</div>
            <p className="text-xs text-muted-foreground">{bursaryStats.pending} pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Aid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bursaryStats.approved}</div>
            <p className="text-xs text-muted-foreground">Applications approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Ongoing this semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Growth Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Registration Growth</CardTitle>
            <CardDescription>New student registrations per month (2025).</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRegistrations}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#333", border: "none", borderRadius: "8px", color: "#fff" }}
                    cursor={{fill: 'transparent'}}
                />
                <Bar dataKey="total" fill="#34495E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Demographics Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>Distribution by Age Group.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={demographicsData.length > 0 ? demographicsData : [{name: 'No Data', value: 1}]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Audit Placeholder */}
      <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Financial Audit Overview</CardTitle>
            <CardDescription>Breakdown of bursary disbursements vs approvals.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-slate-400">
                Financial Audit Report Widget (Coming Soon)
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
