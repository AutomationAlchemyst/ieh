"use client";

import { useState } from "react";
import { Bot, Check, Power, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function AISettings() {
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("************************");
  const [status, setStatus] = useState<"active" | "offline">("active");

  const handleTestConnection = () => {
    toast({
        title: "Testing Connection...",
        description: "Pinging Genkit service...",
    });
    setTimeout(() => {
        toast({
            title: "Connection Successful",
            description: "Genkit is responding correctly.",
        });
        setStatus("active");
    }, 1500);
  };

  return (
    <div className="space-y-6">
       <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" /> Genkit Integration
                    </CardTitle>
                    <CardDescription>Configure the AI bot for automated grading and support.</CardDescription>
                </div>
                <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                    {status === 'active' ? 'Online' : 'Offline'}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="ai-toggle">Enable AI Assistant</Label>
                    <span className="text-sm text-muted-foreground">Allow the bot to interact with students and process data.</span>
                </div>
                <Switch id="ai-toggle" checked={enabled} onCheckedChange={setEnabled} />
            </div>
            
            <div className="space-y-2">
                <Label>API Key (Google Gemini)</Label>
                <div className="flex gap-2">
                    <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} disabled={!enabled} />
                    <Button variant="outline" onClick={() => setApiKey("************************")}>Reset</Button>
                </div>
            </div>

             <div className="space-y-2">
                <Label>Model Selection</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="border-primary bg-primary/10">Gemini 1.5 Pro</Button>
                    <Button variant="outline">Gemini 1.5 Flash</Button>
                    <Button variant="outline">Gemma 2 (Local)</Button>
                </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between py-4">
              <Button variant="ghost" className="text-muted-foreground" onClick={handleTestConnection}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Test Connection
              </Button>
              <Button disabled={!enabled}>
                  <Save className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
          </CardFooter>
       </Card>

       <Card>
           <CardHeader>
               <CardTitle>Automated Tasks</CardTitle>
               <CardDescription>Select which tasks the AI is allowed to perform autonomously.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Switch id="task-grading" defaultChecked />
                    <Label htmlFor="task-grading">Grading Quiz Submissions</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="task-support" defaultChecked />
                    <Label htmlFor="task-support">First-line Student Support Chat</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="task-matching" />
                    <Label htmlFor="task-matching">Suggesting Student-Teacher Matches</Label>
                </div>
           </CardContent>
       </Card>
    </div>
  );
}

function Save(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
    )
  }
