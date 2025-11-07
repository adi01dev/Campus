import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, BookOpen, User, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';

const SubjectAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const assignments = [
    {
      id: 1,
      subject: 'Data Structures & Algorithms',
      code: 'CSE201',
      faculty: 'Dr. Priya Sharma',
      department: 'Computer Science',
      semester: 'Semester 3',
      students: 45,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      room: 'CS Lab 1',
      credits: 4,
      status: 'assigned'
    },
    {
      id: 2,
      subject: 'Machine Learning',
      code: 'CSE301',
      faculty: 'Prof. Rahul Patel',
      department: 'Computer Science',
      semester: 'Semester 5',
      students: 38,
      schedule: 'Tue, Thu - 2:00 PM',
      room: 'CS-205',
      credits: 3,
      status: 'assigned'
    },
    {
      id: 3,
      subject: 'Digital Electronics',
      code: 'ECE102',
      faculty: 'Dr. Anita Gupta',
      department: 'Electronics',
      semester: 'Semester 2',
      students: 52,
      schedule: 'Mon, Wed, Fri - 11:30 AM',
      room: 'ECE Lab 2',
      credits: 4,
      status: 'assigned'
    },
    {
      id: 4,
      subject: 'Thermodynamics',
      code: 'MECH201',
      faculty: 'Unassigned',
      department: 'Mechanical',
      semester: 'Semester 4',
      students: 41,
      schedule: 'TBD',
      room: 'TBD',
      credits: 3,
      status: 'pending'
    }
  ];

  const facultyMembers = [
    { name: 'Dr. Priya Sharma', department: 'Computer Science', subjects: 5 },
    { name: 'Prof. Rahul Patel', department: 'Computer Science', subjects: 3 },
    { name: 'Dr. Anita Gupta', department: 'Electronics', subjects: 4 },
    { name: 'Prof. Vikram Singh', department: 'Mechanical', subjects: 2 }
  ];

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
            Subject Assignment
          </h1>
          <p className="text-muted-foreground mt-2">Assign subjects to faculty members and manage schedules</p>
        </div>
        <Button className="glass-card">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                  <p className="text-2xl font-bold text-green-500">142</p>
                </div>
                <User className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-500">14</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Faculty Load</p>
                  <p className="text-2xl font-bold">3.2</p>
                  <p className="text-xs text-muted-foreground">Avg subjects/faculty</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
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
              <CardTitle>Subject Assignments</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="sem1">Semester 1</SelectItem>
                    <SelectItem value="sem2">Semester 2</SelectItem>
                    <SelectItem value="sem3">Semester 3</SelectItem>
                    <SelectItem value="sem4">Semester 4</SelectItem>
                    <SelectItem value="sem5">Semester 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    className="p-4 border rounded-lg glass-card hover:bg-accent/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{assignment.subject}</h3>
                          <Badge variant="outline">{assignment.code}</Badge>
                          <Badge variant={assignment.status === 'assigned' ? 'default' : 'secondary'}>
                            {assignment.status === 'assigned' ? 'Assigned' : 'Pending'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p><span className="font-medium">Faculty:</span> {assignment.faculty}</p>
                            <p><span className="font-medium">Department:</span> {assignment.department}</p>
                            <p><span className="font-medium">Semester:</span> {assignment.semester}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Students:</span> {assignment.students}</p>
                            <p><span className="font-medium">Schedule:</span> {assignment.schedule}</p>
                            <p><span className="font-medium">Room:</span> {assignment.room}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {assignment.status === 'pending' && (
                          <Button size="sm" className="glass-card">Assign</Button>
                        )}
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
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Faculty Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facultyMembers.map((faculty, index) => (
                  <motion.div
                    key={faculty.name}
                    className="flex items-center gap-3 p-3 border rounded-lg glass-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.name}`} />
                      <AvatarFallback className="text-xs">{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{faculty.name}</p>
                      <p className="text-xs text-muted-foreground">{faculty.department}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {faculty.subjects} subjects
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SubjectAssignment;