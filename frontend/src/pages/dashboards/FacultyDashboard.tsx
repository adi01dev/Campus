import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  BookOpen,
  Clock,
  FileText,
  QrCode,
  MessageSquare,
  Brain,
  Calendar,
  Upload,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Target
} from 'lucide-react';


import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const FacultyDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 1. Fetch Me
        const userRes = await fetch(`${API_BASE}/auth/me`, { headers });
        if (userRes.ok) setUser(await userRes.json());

        // 2. Fetch Stats
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`, { headers });
        if (statsRes.ok) setStats(await statsRes.json());

        // 3. Fetch Schedule
        const scheduleRes = await fetch(`${API_BASE}/dashboard/schedule`, { headers });
        if (scheduleRes.ok) setSchedule(await scheduleRes.json());

      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickStats = [
    { icon: BookOpen, label: 'Courses Teaching', value: stats.coursesTeaching?.toString() || '0', color: 'text-primary' },
    { icon: Users, label: 'Total Students', value: stats.totalStudents?.toString() || '0', color: 'text-success' },
    { icon: MessageSquare, label: 'Pending Queries', value: stats.pendingQueries?.toString() || '0', color: 'text-warning' },
    { icon: FileText, label: 'Assignments to Review', value: stats.assignmentsToReview?.toString() || '0', color: 'text-secondary' },
  ];

  // Static for now, as no Query API endpoint fully integrated in dashboard yet specific for this view
  const studentQueries = [
    { student: 'Ansh Dubey', query: 'Clarification on Database Normalization', course: 'DBMS', time: '2 hours ago', urgent: false },
    { student: 'Ramesh Kumar', query: 'Assignment submission deadline extension', course: 'DSA', time: '4 hours ago', urgent: true },
  ];

  const classPerformance = [
    { course: 'Database Systems', attendance: 89, avgScore: 85, assignments: 8 },
    { course: 'Data Structures', attendance: 92, avgScore: 78, assignments: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name || 'Faculty'}</h1>
            <p className="text-white/80 text-lg">
              You have {schedule.length} classes scheduled today and {stats.pendingQueries || 0} student queries waiting.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>{user?.department || 'Department'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Faculty</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <QrCode className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">QR Attendance</p>
              <Button variant="secondary" size="sm" className="mt-2">
                Start Session
              </Button>
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
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No classes scheduled today.</p>
              ) : (
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-foreground">{item.course}</p>
                          <p className="text-sm text-muted-foreground">{item.startTime} - {item.endTime} • {item.room}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{item.studentsCount || 0} students</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Take Attendance
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student Queries & Class Performance */}
        <div className="xl:col-span-2 space-y-6">
          {/* Student Queries */}
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Student Queries
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentQueries.map((query, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className={`p-1 rounded-full mt-1 ${query.urgent ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                      {query.urgent ? (
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      ) : (
                        <MessageSquare className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{query.student}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{query.course}</Badge>
                          {query.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{query.query}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{query.time}</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Performance */}
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Class Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classPerformance.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{item.course}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.assignments} Assignments
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className="font-medium">{item.attendance}%</span>
                        </div>
                        <Progress value={item.attendance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Avg Score</span>
                          <span className="font-medium">{item.avgScore}%</span>
                        </div>
                        <Progress value={item.avgScore} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Upload Materials</h3>
            <p className="text-sm text-muted-foreground">Notes, assignments & resources</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">QR Attendance</h3>
            <p className="text-sm text-muted-foreground">Start attendance session</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Predictions</h3>
            <p className="text-sm text-muted-foreground">Student performance insights</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="bg-success/80 p-3 rounded-full w-fit mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Schedule Classes</h3>
            <p className="text-sm text-muted-foreground">Manage your timetable</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;