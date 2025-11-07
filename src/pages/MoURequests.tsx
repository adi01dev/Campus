import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { FileText, Building2, Clock, CheckCircle, XCircle, Plus, Calendar, Users } from "lucide-react";
import { useState } from "react";

const MoURequests = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const existingMoUs = [
    {
      id: "1",
      organization: "TCS India",
      type: "Industry Partnership",
      status: "approved",
      submittedDate: "2024-02-15",
      purpose: "Student Internship Program",
      duration: "3 years",
      contact: "hr@tcs.com"
    },
    {
      id: "2",
      organization: "IIT Delhi",
      type: "Academic Collaboration",
      status: "pending",
      submittedDate: "2024-03-01",
      purpose: "Research Collaboration",
      duration: "5 years",
      contact: "partnerships@iitd.ac.in"
    },
    {
      id: "3",
      organization: "Microsoft India",
      type: "Technology Partnership",
      status: "under_review",
      submittedDate: "2024-02-28",
      purpose: "Technology Training Program",
      duration: "2 years",
      contact: "education@microsoft.com"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 border-green-200 bg-green-50";
      case "pending": return "text-orange-600 border-orange-200 bg-orange-50";
      case "under_review": return "text-blue-600 border-blue-200 bg-blue-50";
      case "rejected": return "text-red-600 border-red-200 bg-red-50";
      default: return "text-gray-600 border-gray-200 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "under_review": return <FileText className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <BreadcrumbNav />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MoU Requests</h1>
              <p className="text-muted-foreground">Manage Memorandum of Understanding requests and partnerships</p>
            </div>
          </div>
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New MoU Request
          </Button>
        </div>

        {showNewRequest && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Submit New MoU Request</CardTitle>
                <CardDescription>Fill out the details for your partnership request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input placeholder="Enter organization name" />
                  </div>
                  <div>
                    <Label htmlFor="mou-type">MoU Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select MoU type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industry">Industry Partnership</SelectItem>
                        <SelectItem value="academic">Academic Collaboration</SelectItem>
                        <SelectItem value="technology">Technology Partnership</SelectItem>
                        <SelectItem value="research">Research Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input placeholder="contact@organization.com" />
                  </div>
                  <div>
                    <Label htmlFor="duration">Partnership Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose & Objectives</Label>
                  <Textarea 
                    placeholder="Describe the purpose and objectives of this partnership..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Expected Benefits</Label>
                  <Textarea 
                    placeholder="Outline the expected benefits for both parties..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button>Submit Request</Button>
                  <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                MoU Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-green-50/50 rounded-lg border border-green-200/50"
                >
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-orange-50/50 rounded-lg border border-orange-200/50"
                >
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">1</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-blue-50/50 rounded-lg border border-blue-200/50"
                >
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-gray-50/50 rounded-lg border border-gray-200/50"
                >
                  <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">3</p>
                  <p className="text-sm text-muted-foreground">Total MoUs</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>All MoU Requests</CardTitle>
              <CardDescription>Track and manage your partnership requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingMoUs.map((mou, index) => (
                  <motion.div
                    key={mou.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg bg-card/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{mou.organization}</h3>
                        <p className="text-sm text-muted-foreground">{mou.type}</p>
                      </div>
                      <Badge className={getStatusColor(mou.status)}>
                        {getStatusIcon(mou.status)}
                        {mou.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Purpose:</strong> {mou.purpose}</p>
                        <p><strong>Duration:</strong> {mou.duration}</p>
                      </div>
                      <div>
                        <p><strong>Contact:</strong> {mou.contact}</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <strong>Submitted:</strong> {mou.submittedDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default MoURequests;