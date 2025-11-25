"use client";

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./general-settings"
import { NotificationSettings } from "./notification-settings"
import { AISettings } from "./ai-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system configurations, automated logic, and integrations.
        </p>
      </div>
      <Separator />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Integration</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
            <GeneralSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
            <AISettings />
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
                    <CardDescription>View permissions associated with each user role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">Administrator</h4>
                                <p className="text-sm text-muted-foreground">Full access to all modules and settings.</p>
                            </div>
                            <Badge>System Owner</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">Management</h4>
                                <p className="text-sm text-muted-foreground">Can view reports, users, and finances. Cannot edit system settings.</p>
                            </div>
                            <Badge variant="outline">Read/Write</Badge>
                        </div>
                         <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">Teacher (Asatizah)</h4>
                                <p className="text-sm text-muted-foreground">Access to own courses, assigned students, and schedule.</p>
                            </div>
                            <Badge variant="secondary">Limited</Badge>
                        </div>
                         <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">Student</h4>
                                <p className="text-sm text-muted-foreground">Access to enrolled courses and personal profile only.</p>
                            </div>
                            <Badge variant="secondary">Restricted</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
