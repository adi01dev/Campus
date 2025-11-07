import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, BookOpen, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

const ClassSchedule = () => {
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const scheduleData = [
    {
      id: 1,
      time: '09:00 - 10:00',
      monday: { subject: 'Data Structures', faculty: 'Dr. Priya Sharma', room: 'CS-101', students: 45 },
      tuesday: { subject: 'Machine Learning', faculty: 'Prof. Rahul Patel', room: 'CS Lab 2', students: 38 },
      wednesday: { subject: 'Database Systems', faculty: 'Dr. Priya Sharma', room: 'CS-205', students: 42 },
      thursday: { subject: 'Algorithms', faculty: 'Dr. Priya Sharma', room: 'CS-101', students: 40 },
      friday: { subject: 'Software Engineering', faculty: 'Prof. Amit Kumar', room: 'CS-302', students: 35 },
    },
    {
      id: 2,
      time: '10:00 - 11:00',
      monday: { subject: 'Machine Learning', faculty: 'Prof. Rahul Patel', room: 'CS Lab 2', students: 38 },
      tuesday: { subject: 'Database Systems', faculty: 'Dr. Priya Sharma', room: 'CS-205', students: 42 },
      wednesday: { subject: 'Data Structures', faculty: 'Dr. Priya Sharma', room: 'CS-101', students: 45 },
      thursday: { subject: 'Software Engineering', faculty: 'Prof. Amit Kumar', room: 'CS-302', students: 35 },
      friday: { subject: 'Algorithms', faculty: 'Dr. Priya Sharma', room: 'CS-101', students: 40 },
    },
    {
      id: 3,
      time: '11:30 - 12:30',
      monday: null,
      tuesday: { subject: 'Digital Electronics', faculty: 'Dr. Anita Gupta', room: 'ECE Lab 1', students: 52 },
      wednesday: { subject: 'Microprocessors', faculty: 'Dr. Anita Gupta', room: 'ECE-201', students: 48 },
      thursday: { subject: 'VLSI Design', faculty: 'Prof. Suresh Reddy', room: 'ECE Lab 2', students: 35 },
      friday: { subject: 'Communication Systems', faculty: 'Dr. Rajesh Nair', room: 'ECE-105', students: 44 },
    },
    {
      id: 4,
      time: '02:00 - 03:00',
      monday: { subject: 'Thermodynamics', faculty: 'Prof. Vikram Singh', room: 'MECH-101', students: 41 },
      tuesday: { subject: 'Fluid Mechanics', faculty: 'Dr. Sanjay Joshi', room: 'MECH Lab', students: 38 },
      wednesday: { subject: 'Manufacturing Processes', faculty: 'Prof. Vikram Singh', room: 'Workshop', students: 35 },
      thursday: { subject: 'Machine Design', faculty: 'Dr. Ramesh Gupta', room: 'MECH-205', students: 42 },
      friday: { subject: 'Heat Transfer', faculty: 'Dr. Sanjay Joshi', room: 'MECH-101', students: 39 },
    },
    {
      id: 5,
      time: '03:00 - 04:00',
      monday: { subject: 'Lab Session', faculty: 'Dr. Priya Sharma', room: 'CS Lab 1', students: 22 },
      tuesday: { subject: 'Lab Session', faculty: 'Prof. Rahul Patel', room: 'CS Lab 2', students: 19 },
      wednesday: { subject: 'Lab Session', faculty: 'Dr. Anita Gupta', room: 'ECE Lab 1', students: 26 },
      thursday: { subject: 'Lab Session', faculty: 'Prof. Vikram Singh', room: 'MECH Lab', students: 21 },
      friday: { subject: 'Tutorial', faculty: 'Various', room: 'Multiple', students: 180 },
    }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Data Structures': 'bg-blue-100 text-blue-800 border-blue-200',
      'Machine Learning': 'bg-green-100 text-green-800 border-green-200',
      'Database Systems': 'bg-purple-100 text-purple-800 border-purple-200',
      'Algorithms': 'bg-orange-100 text-orange-800 border-orange-200',
      'Software Engineering': 'bg-pink-100 text-pink-800 border-pink-200',
      'Digital Electronics': 'bg-red-100 text-red-800 border-red-200',
      'Microprocessors': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'VLSI Design': 'bg-teal-100 text-teal-800 border-teal-200',
      'Communication Systems': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Thermodynamics': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Fluid Mechanics': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Manufacturing Processes': 'bg-lime-100 text-lime-800 border-lime-200',
      'Machine Design': 'bg-amber-100 text-amber-800 border-amber-200',
      'Heat Transfer': 'bg-rose-100 text-rose-800 border-rose-200',
      'Lab Session': 'bg-gray-100 text-gray-800 border-gray-200',
      'Tutorial': 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

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
            Class Schedule
          </h1>
          <p className="text-muted-foreground mt-2">Manage and view class timetables across departments</p>
        </div>
        <Button className="glass-card">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
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
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold text-green-500">8</p>
                  <p className="text-xs text-muted-foreground">Classes ongoing</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Faculty Engaged</p>
                  <p className="text-2xl font-bold text-purple-500">28</p>
                  <p className="text-xs text-muted-foreground">Out of 45</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Room Utilization</p>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
            <div className="flex gap-4 items-center">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
                    {days.map((day) => (
                      <th key={day} className="text-left p-3 font-medium text-muted-foreground min-w-[200px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((slot, index) => (
                    <motion.tr 
                      key={slot.id} 
                      className="border-b hover:bg-accent/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {slot.time}
                        </div>
                      </td>
                      {days.map((day) => {
                        const dayKey = day.toLowerCase() as keyof typeof slot;
                        const classInfo = slot[dayKey] as any;
                        
                        return (
                          <td key={day} className="p-3">
                            {classInfo ? (
                              <div className={`p-3 rounded-lg border ${getSubjectColor(classInfo.subject)}`}>
                                <div className="space-y-1">
                                  <h4 className="font-medium text-sm">{classInfo.subject}</h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      <span>{classInfo.faculty}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{classInfo.room}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>{classInfo.students} students</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 text-center text-muted-foreground text-sm">
                                Free Period
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ClassSchedule;