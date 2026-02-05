import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrReader from "react-qr-reader-es6"; // npm install react-qr-reader
import { useState, useEffect } from "react";
import { Progress } from '@/components/ui/progress';
import AIAssistant from '../AIAssistant';
import MoURequests from '../MoURequests';
import FeePayment from '../FeePayment';
import { Link } from 'react-router-dom';
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

  const [scanOpen, setScanOpen] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("accessToken");

  // Dynamic Data State
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [schedule, setSchedule] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Parallel fetch
        const [userRes, statsRes, scheduleRes, assignRes] = await Promise.all([
          fetch(`${API_BASE}/auth/me`, { headers }),
          fetch(`${API_BASE}/dashboard/stats`, { headers }),
          fetch(`${API_BASE}/dashboard/schedule`, { headers }),
          fetch(`${API_BASE}/assignments`, { headers })
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
        if (scheduleRes.ok) setSchedule(await scheduleRes.json());
        if (assignRes.ok) setAssignments(await assignRes.json());

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchDashboardData();
  }, [token]);

  // Derived Data for UI
  const quickStats = [
    { label: 'Overall Attendance', value: '85%', change: '+2.5%', icon: Calendar, color: 'text-blue-500' },
    { label: 'Pending Assignments', value: stats.assignmentsPending?.toString() || '0', change: 'Due Soon', icon: FileText, color: 'text-orange-500' },
    { label: 'Classes Today', value: stats.classesToday?.toString() || schedule.length.toString(), change: 'On Time', icon: Clock, color: 'text-green-500' },
    { label: 'Enrolled Courses', value: stats.enrolledCourses?.toString() || '0', change: 'Active', icon: BookOpen, color: 'text-purple-500' },
  ];

  const todaysSchedule = schedule.map((item: any) => ({
    time: `${item.startTime}`,
    subject: item.course,
    room: item.room,
    type: item.type
  }));

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

  const [offlineScans, setOfflineScans] = useState<any[]>(() => {
    const saved = localStorage.getItem("offline_attendance");
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-sync when coming online
  useEffect(() => {
    const handleOnline = () => {
      if (offlineScans.length > 0) {
        toast({ title: "Back Online", description: "Syncing offline attendance..." });
        syncOfflineAttendance();
      }
    };

    window.addEventListener('online', handleOnline);

    // Also try initial sync if we have data and are connected
    if (navigator.onLine && offlineScans.length > 0) {
      syncOfflineAttendance();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, [offlineScans]);

  const handleScan = async (qrPayload: string | null) => {
    if (!qrPayload) return;

    // Check if result is already processed to avoid double scans
    setScanOpen(false);

    try {
      // 1. Parse Payload to validate format immediately
      const parts = qrPayload.split(":");
      if (parts.length !== 4) {
        throw new Error("Invalid QR Code format");
      }
      const [sessionId, nonce, timestampStr, signature] = parts;

      const scanTime = Date.now();
      const genTime = parseInt(timestampStr);
      const scanDelay = scanTime - genTime;

      const payloadData = {
        sessionId,
        qrPayload,
        scanDelay,
        timestamp: scanTime
      };

      // 2. Check Connection
      if (!navigator.onLine) {
        const updated = [...offlineScans, payloadData];
        setOfflineScans(updated);
        localStorage.setItem("offline_attendance", JSON.stringify(updated));
        toast({ title: "Saved Offline", description: "Attendance will sync when online." });
        return;
      }

      // 3. Online: Send to Backend
      await submitAttendance(payloadData);

    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const submitAttendance = async (data: any) => {
    const res = await fetch(`${API_BASE}/student/attendance/mark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message);
    toast({ title: "Attendance Marked", description: resData.message });
  };

  const syncOfflineAttendance = async () => {
    let syncedCount = 0;
    const remaining: any[] = [];

    for (const scan of offlineScans) {
      try {
        await submitAttendance(scan);
        syncedCount++;
      } catch (err) {
        console.error("Sync failed for", scan, err);
        remaining.push(scan); // Keep failed ones
      }
    }

    setOfflineScans(remaining);
    localStorage.setItem("offline_attendance", JSON.stringify(remaining));

    if (syncedCount > 0) {
      toast({ title: "Sync Complete", description: `Uploaded ${syncedCount} records.` });
    }
  };

  const handleError = (err: any) => {
    // Suppress minor scanning errors
    console.log(err);
  };


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name || 'Student'}</h1>
            <p className="text-white/80 text-lg">
              Ready to continue your learning journey? You have {assignments.length || stats.assignmentsPending || 0} assignments due.
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
          <Button variant="outline" className="w-full mb-2">
            Start Scanner
          </Button>

          {offlineScans.length > 0 && (
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600 animate-pulse"
              onClick={(e) => {
                e.stopPropagation();
                syncOfflineAttendance();
              }}
            >
              Sync Offline ({offlineScans.length})
            </Button>
          )}
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

            <Link to="/fee-payment">
              <Button variant="outline" className="w-full">
                Pay Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Study Helper</h3>
            <p className="text-sm text-muted-foreground mb-4">Get personalized course recommendations</p>
            <Link to="/ai-assistant">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">MoU Requests</h3>
            <p className="text-sm text-muted-foreground mb-4">Submit memorandum requests to faculty</p>
            <Link to="/mou-requests"
            >
              <Button variant="outline" className="w-full">
                Submit Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;