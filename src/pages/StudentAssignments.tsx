import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Search, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const assignments = [
    {
      id: 1,
      title: "Data Structures - Binary Trees",
      subject: "Computer Science",
      dueDate: "2024-03-15",
      status: "pending",
      marks: 25,
      submittedOn: null,
      grade: null,
    },
    {
      id: 2,
      title: "Circuit Analysis Assignment",
      subject: "Electronics",
      dueDate: "2024-03-12",
      status: "submitted",
      marks: 30,
      submittedOn: "2024-03-10",
      grade: null,
    },
    {
      id: 3,
      title: "Thermodynamics Problem Set",
      subject: "Mechanical Engineering",
      dueDate: "2024-03-08",
      status: "graded",
      marks: 20,
      submittedOn: "2024-03-07",
      grade: "18/20",
    },
    {
      id: 4,
      title: "Database Design Project",
      subject: "Computer Science",
      dueDate: "2024-03-20",
      status: "pending",
      marks: 40,
      submittedOn: null,
      grade: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      submitted: { variant: "secondary", icon: Upload },
      graded: { variant: "default", icon: CheckCircle },
      overdue: { variant: "destructive", icon: AlertCircle },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAssignments = filteredAssignments.filter(a => a.status === "pending");
  const submittedAssignments = filteredAssignments.filter(a => a.status === "submitted");
  const gradedAssignments = filteredAssignments.filter(a => a.status === "graded");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Assignments
            </h1>
            <p className="text-muted-foreground mt-1">View and submit your course assignments</p>
          </div>
          <Button onClick={() => navigate('/my-courses')} variant="outline">
            View Courses
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingAssignments.length}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{submittedAssignments.length}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Graded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{gradedAssignments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments by title or subject..."
            className="pl-10 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Assignments Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <TabsTrigger value="all">All Assignments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {assignment.title}
                      </CardTitle>
                      <CardDescription>{assignment.subject}</CardDescription>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(assignment.dueDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Marks</p>
                      <p className="font-medium">{assignment.marks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted On</p>
                      <p className="font-medium">
                        {assignment.submittedOn ? new Date(assignment.submittedOn).toLocaleDateString('en-IN') : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-medium">{assignment.grade || '-'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {assignment.status === "pending" && (
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Submit Assignment
                      </Button>
                    )}
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN')}</span>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="submitted" className="space-y-4">
            {submittedAssignments.map((assignment) => (
              <Card key={assignment.id} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submitted on: {assignment.submittedOn && new Date(assignment.submittedOn).toLocaleDateString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground mt-2">Awaiting grading...</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="graded" className="space-y-4">
            {gradedAssignments.map((assignment) => (
              <Card key={assignment.id} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p>Grade: <span className="font-bold text-green-600">{assignment.grade}</span></p>
                      <p className="text-sm text-muted-foreground">Submitted: {assignment.submittedOn && new Date(assignment.submittedOn).toLocaleDateString('en-IN')}</p>
                    </div>
                    <Button variant="outline">View Feedback</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentAssignments;
