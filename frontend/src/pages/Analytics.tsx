import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  GraduationCap,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Target,
  Award,
  Clock,
  FileText,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const analyticsCards = [
    { title: 'Total Students', value: '1,247', change: '+5.2%', icon: Users, trend: 'up' },
    { title: 'Active Courses', value: '89', change: '+2.1%', icon: BookOpen, trend: 'up' },
    { title: 'Faculty Members', value: '156', change: '+1.8%', icon: GraduationCap, trend: 'up' },
    { title: 'Avg Attendance', value: '87.5%', change: '+3.2%', icon: Target, trend: 'up' },
  ];

  const performanceMetrics = [
    { department: 'Computer Science', students: 312, avgGrade: 'A-', attendance: 92, passRate: 94 },
    { department: 'Electronics', students: 289, avgGrade: 'B+', attendance: 89, passRate: 91 },
    { department: 'Mechanical', students: 267, avgGrade: 'B+', attendance: 87, passRate: 88 },
    { department: 'Civil', students: 223, avgGrade: 'B', attendance: 85, passRate: 86 },
    { department: 'Electrical', students: 156, avgGrade: 'A-', attendance: 90, passRate: 92 },
  ];

  const monthlyData = [
    { month: 'Apr', admissions: 45, graduations: 0, revenue: 2.4 },
    { month: 'May', admissions: 89, graduations: 234, revenue: 3.1 },
    { month: 'Jun', admissions: 67, graduations: 0, revenue: 2.8 },
    { month: 'Jul', admissions: 123, graduations: 0, revenue: 4.2 },
    { month: 'Aug', admissions: 98, graduations: 0, revenue: 3.6 },
    { month: 'Sep', admissions: 76, graduations: 0, revenue: 2.9 },
  ];

  const topPerformers = [
    { name: 'Aarav Patel', department: 'Computer Science', score: 98.5, rank: 1 },
    { name: 'Priya Singh', department: 'Electronics', score: 97.2, rank: 2 },
    { name: 'Rahul Kumar', department: 'Mechanical', score: 96.8, rank: 3 },
    { name: 'Sneha Sharma', department: 'Computer Science', score: 96.3, rank: 4 },
    { name: 'Vikram Gupta', department: 'Civil', score: 95.9, rank: 5 },
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BreadcrumbNav />
      
      {/* Header */}
      <motion.div 
        className="flex justify-between items-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into institutional performance and student analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-success mr-1" />
                      <Badge variant="default" className="text-xs">
                        {card.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-primary">
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance by Department */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((dept, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-foreground">{dept.department}</h4>
                      <Badge variant="outline" className="text-xs">{dept.students} students</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Avg Grade</p>
                        <p className="font-bold text-primary">{dept.avgGrade}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Attendance</p>
                        <p className="font-bold text-success">{dept.attendance}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Pass Rate</p>
                        <p className="font-bold text-secondary">{dept.passRate}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((student, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{student.rank}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{student.score}%</p>
                      <Badge variant="secondary" className="text-xs">
                        Rank #{student.rank}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-effect border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Monthly Trends & Revenue
            </CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Change Period
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {monthlyData.map((data, index) => (
                <motion.div 
                  key={index}
                  className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-semibold text-foreground mb-3">{data.month} 2024</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Admissions</p>
                      <p className="font-bold text-primary">{data.admissions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Graduations</p>
                      <p className="font-bold text-success">{data.graduations}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-bold text-secondary">₹{data.revenue}L</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Analytics Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer hover-lift">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Generate Reports</h3>
              <p className="text-sm text-muted-foreground mb-4">Create detailed analytical reports</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: 'Generating Report',
                    description: 'Your analytics report is being prepared...',
                  });
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer hover-lift">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Predictive Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">AI-powered performance predictions</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/ai-predictions')}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Predictions
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer hover-lift">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Custom Dashboards</h3>
              <p className="text-sm text-muted-foreground mb-4">Build personalized analytics views</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: 'Dashboard Customization',
                    description: 'Customize your analytics dashboard layout and widgets.',
                  });
                }}
              >
                <Target className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;