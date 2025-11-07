import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MyAttendance = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const attendanceData = [
    { month: 'Aug', percentage: 88 },
    { month: 'Sep', percentage: 92 },
    { month: 'Oct', percentage: 89 },
    { month: 'Nov', percentage: 95 },
    { month: 'Dec', percentage: 91 },
    { month: 'Jan', percentage: 94 }
  ];

  const subjectAttendance = [
    {
      subject: 'Data Structures',
      code: 'CSE201',
      totalClasses: 45,
      attendedClasses: 42,
      percentage: 93.3,
      status: 'good',
      lastAttended: '2024-01-08',
      requiredPercentage: 75
    },
    {
      subject: 'Machine Learning',
      code: 'CSE301',
      totalClasses: 38,
      attendedClasses: 32,
      percentage: 84.2,
      status: 'good',
      lastAttended: '2024-01-07',
      requiredPercentage: 75
    },
    {
      subject: 'Database Systems',
      code: 'CSE205',
      totalClasses: 42,
      attendedClasses: 39,
      percentage: 92.9,
      status: 'good',
      lastAttended: '2024-01-08',
      requiredPercentage: 75
    },
    {
      subject: 'Algorithms',
      code: 'CSE203',
      totalClasses: 40,
      attendedClasses: 29,
      percentage: 72.5,
      status: 'warning',
      lastAttended: '2024-01-05',
      requiredPercentage: 75
    },
    {
      subject: 'Software Engineering',
      code: 'CSE302',
      totalClasses: 35,
      attendedClasses: 33,
      percentage: 94.3,
      status: 'excellent',
      lastAttended: '2024-01-08',
      requiredPercentage: 75
    }
  ];

  const recentAttendance = [
    { date: '2024-01-08', subject: 'Data Structures', time: '10:00 AM', status: 'present' },
    { date: '2024-01-08', subject: 'Database Systems', time: '11:30 AM', status: 'present' },
    { date: '2024-01-08', subject: 'Software Engineering', time: '2:00 PM', status: 'present' },
    { date: '2024-01-07', subject: 'Machine Learning', time: '2:00 PM', status: 'present' },
    { date: '2024-01-05', subject: 'Algorithms', time: '9:00 AM', status: 'absent' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge variant="default" className="bg-green-500">Excellent</Badge>;
      case 'good': return <Badge variant="default">Good</Badge>;
      case 'warning': return <Badge variant="destructive">Below Required</Badge>;
      default: return <Badge variant="secondary">Average</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const overallAttendance = Math.round(
    subjectAttendance.reduce((acc, subject) => acc + subject.percentage, 0) / subjectAttendance.length
  );

  return (
    <motion.div 
      className="space-y-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreadcrumbNav />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-muted-foreground mt-2">Track your attendance across all subjects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <p className={`text-2xl font-bold ${overallAttendance >= 90 ? 'text-green-500' : overallAttendance >= 75 ? 'text-blue-500' : 'text-red-500'}`}>
                    {overallAttendance}%
                  </p>
                </div>
                <CalendarDays className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classes This Week</p>
                  <p className="text-2xl font-bold text-green-500">18/20</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subjects at Risk</p>
                  <p className="text-2xl font-bold text-red-500">1</p>
                  <p className="text-xs text-muted-foreground">Below 75%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Trend</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-green-500">+2.5%</p>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectAttendance.map((subject) => (
                  <SelectItem key={subject.code} value={subject.code}>{subject.subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAttendance.map((subject, index) => (
                <motion.div
                  key={subject.code}
                  className="p-4 border rounded-lg glass-card hover:bg-accent/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        <Badge variant="outline">{subject.code}</Badge>
                        {getStatusIcon(subject.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last attended: {subject.lastAttended}
                      </p>
                    </div>
                    {getStatusBadge(subject.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance: {subject.attendedClasses}/{subject.totalClasses} classes</span>
                      <span className={`font-medium ${subject.percentage >= subject.requiredPercentage ? 'text-green-600' : 'text-red-600'}`}>
                        {subject.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={subject.percentage} 
                      className={`h-2 ${subject.percentage < subject.requiredPercentage ? 'bg-red-100' : 'bg-green-100'}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Required: {subject.requiredPercentage}%</span>
                      <span>
                        {subject.percentage >= subject.requiredPercentage 
                          ? `${(subject.percentage - subject.requiredPercentage).toFixed(1)}% above required` 
                          : `${(subject.requiredPercentage - subject.percentage).toFixed(1)}% below required`
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-sm">{record.subject}</p>
                      <p className="text-xs text-muted-foreground">{record.date} at {record.time}</p>
                    </div>
                  </div>
                  <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MyAttendance;