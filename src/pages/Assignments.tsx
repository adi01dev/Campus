import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Assignments = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const assignments = [
    {
      id: 1,
      title: "Data Structures - Binary Trees Implementation",
      course: "Data Structures & Algorithms",
      dueDate: "2024-03-20",
      totalMarks: 25,
      submissions: 35,
      totalStudents: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Database Design Project - Library Management",
      course: "Database Management Systems",
      dueDate: "2024-03-25",
      totalMarks: 40,
      submissions: 28,
      totalStudents: 45,
      status: "Active",
    },
    {
      id: 3,
      title: "Operating Systems - Process Scheduling",
      course: "Operating Systems",
      dueDate: "2024-03-15",
      totalMarks: 30,
      submissions: 45,
      totalStudents: 45,
      status: "Grading",
    },
  ];

  const stats = [
    { label: "Active Assignments", value: "8", icon: FileText, color: "text-blue-600" },
    { label: "Total Submissions", value: "256", icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Grading", value: "42", icon: Clock, color: "text-orange-600" },
    { label: "Total Students", value: "45", icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="text-muted-foreground mt-1">Create and manage course assignments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/my-courses')}>
              View Courses
            </Button>
            <Button className="gap-2" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Assignment Form */}
        {showCreateForm && (
          <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Assignment
              </CardTitle>
              <CardDescription>Design a new assignment for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Assignment Title</label>
                  <Input placeholder="Enter assignment title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                      <SelectItem value="dbms">Database Management Systems</SelectItem>
                      <SelectItem value="os">Operating Systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Marks</label>
                  <Input type="number" placeholder="Enter total marks" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Submission Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="text">Text Submission</SelectItem>
                      <SelectItem value="link">Link Submission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Instructions</label>
                  <Textarea placeholder="Enter assignment instructions and requirements" rows={6} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button>Create Assignment</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignments List */}
        <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your Assignments
            </CardTitle>
            <CardDescription>Manage and track all your course assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                    <Badge variant={assignment.status === "Active" ? "default" : "secondary"}>
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(assignment.dueDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Marks</p>
                      <p className="font-medium">{assignment.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submissions</p>
                      <p className="font-medium">
                        {assignment.submissions}/{assignment.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{
                            width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Submissions
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assignments;
