import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrReader from "react-qr-reader-es6"; // npm install react-qr-reader
import { useState } from "react";
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  Clock,
  FileText,
  CreditCard,
  Trophy,
  TrendingUp,
  User,
  MessageSquare,
  Brain,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Target
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const StudentDashboard = () => {
  const quickStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '8', color: 'text-primary' },
    { icon: Calendar, label: 'Classes Today', value: '5', color: 'text-success' },
    { icon: FileText, label: 'Assignments Due', value: '3', color: 'text-warning' },
    { icon: Trophy, label: 'Overall Grade', value: 'A-', color: 'text-secondary' },
  ];

  const todaysSchedule = [
    { time: '9:00 AM', subject: 'Data Structures', room: 'CS-101', type: 'Lecture' },
    { time: '11:00 AM', subject: 'Database Systems', room: 'CS-205', type: 'Practical' },
    { time: '2:00 PM', subject: 'Software Engineering', room: 'CS-301', type: 'Lecture' },
    { time: '4:00 PM', subject: 'Machine Learning', room: 'CS-401', type: 'Tutorial' },
  ];

  const recentAssignments = [
    { title: 'Database Design Project', subject: 'DBMS', dueDate: 'Tomorrow', status: 'pending' },
    { title: 'Algorithm Analysis Report', subject: 'DSA', dueDate: '3 days', status: 'inprogress' },
    { title: 'Software Requirements Document', subject: 'SE', dueDate: '1 week', status: 'completed' },
  ];

  const attendanceData = [
    { subject: 'Data Structures', attended: 28, total: 30, percentage: 93 },
    { subject: 'Database Systems', attended: 25, total: 28, percentage: 89 },
    { subject: 'Software Engineering', attended: 22, total: 25, percentage: 88 },
    { subject: 'Machine Learning', attended: 18, total: 20, percentage: 90 },
  ];

  const [scanOpen, setScanOpen] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("accessToken");

  const handleScan = async (qrToken: string | null) => {
    if (!qrToken) return;

    try {
      const res = await fetch(`${API_BASE}/student/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrToken }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      toast({ title: "Attendance Marked", description: data.message });
      setScanOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleError = (err: any) => {
    toast({ title: "Scan Error", description: err.message, variant: "destructive" });
  };


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, Aarav Patel</h1>
            <p className="text-white/80 text-lg">
              Ready to continue your learning journey? You have 3 assignments due this week.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>Computer Science Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Semester 6</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Today</p>
              <p className="text-2xl font-bold">{new Date().getDate()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-primary`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-1">
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSchedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted-foreground">TIME</p>
                      <p className="text-sm font-bold text-foreground">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.room}</Badge>
                        <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments & Attendance */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recent Assignments */}
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Assignment Tracker
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{assignment.subject}</Badge>
                        <span className="text-xs text-muted-foreground">Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      {assignment.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : assignment.status === 'inprogress' ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{item.subject}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">{item.percentage}%</span>
                        <p className="text-xs text-muted-foreground">{item.attended}/{item.total} classes</p>
                      </div>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className={`h-2 ${item.percentage < 75 ? '[&>div]:bg-destructive' : item.percentage < 85 ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card
        onClick={() => setScanOpen(true)}
        className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer"
      >
        <CardContent className="p-6 text-center">
          <div className="bg-gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Scan Attendance QR</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use camera to scan faculty’s QR code
          </p>
          <Button variant="outline" className="w-full">
            Start Scanner
          </Button>
        </CardContent>
      </Card>

      {/* QR Scanner Modal */}
      {scanOpen && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h2 className="text-white text-xl font-semibold mb-3">Scan Attendance QR</h2>
          <div className="w-72 h-72 bg-white p-2 rounded-lg">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setScanOpen(false)}
          >
            Close
          </Button>
        </div>
      )}
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Pay Fees</h3>
            <p className="text-sm text-muted-foreground mb-4">Semester fee payment due in 15 days</p>
            <Button variant="outline" className="w-full">
              Pay Now
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Study Helper</h3>
            <p className="text-sm text-muted-foreground mb-4">Get personalized course recommendations</p>
            <Button variant="outline" className="w-full">
              Explore
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">MoU Requests</h3>
            <p className="text-sm text-muted-foreground mb-4">Submit memorandum requests to faculty</p>
            <Button variant="outline" className="w-full">
              Submit Request
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;