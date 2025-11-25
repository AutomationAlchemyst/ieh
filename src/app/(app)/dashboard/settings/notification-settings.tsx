"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

type Template = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export function NotificationSettings() {
  const firestore = useFirestore();
  const [templates, setTemplates] = useState<Template[]>([
    { id: "1", name: "Welcome Email", subject: "Welcome to Ihsan Hub!", body: "Dear {name}, welcome to our community..." },
    { id: "2", name: "Payment Receipt", subject: "Receipt for your payment", body: "Dear {name}, we have received your payment of {amount}..." },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (template: Template) => {
    // In reality, this updates Firestore
    toast({
        title: "Template Saved",
        description: `Updated ${template.name}`,
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
        title: "Template Deleted",
        description: "The template has been removed.",
    });
  };

  return (
    <div className="space-y-6">
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Notification Templates</CardTitle>
                <CardDescription>Manage email and SMS templates used by the system.</CardDescription>
            </div>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Template</Button>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Subject Line</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {templates.map((template) => (
                <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(template.id)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(template.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>

        {editingId && (
            <Card>
                 <CardHeader>
                    <CardTitle>Edit Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Template Name" defaultValue={templates.find(t => t.id === editingId)?.name} />
                    </div>
                    <div className="space-y-2">
                        <Input placeholder="Subject Line" defaultValue={templates.find(t => t.id === editingId)?.subject} />
                    </div>
                    <div className="space-y-2">
                        <Textarea placeholder="Body content..." className="min-h-[150px]" defaultValue={templates.find(t => t.id === editingId)?.body} />
                    </div>
                    <div className="flex justify-end gap-2">
                         <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                         <Button onClick={() => handleSave(templates.find(t => t.id === editingId)!)}><Save className="mr-2 h-4 w-4" /> Save Template</Button>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
