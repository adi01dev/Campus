import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  FileText,
  Video,
  Download,
  Upload,
  ExternalLink,
  Star,
  CheckCircle,
  AlertCircle,
  Play,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

const MyCourses = () => {
  const courseStats = [
    {
      title: "Enrolled Courses",
      value: "8",
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: "3",
      icon: CheckCircle,
      color: "text-success",
    },
    { title: "In Progress", value: "4", icon: Clock, color: "text-warning" },
    { title: "Avg Grade", value: "A-", icon: Award, color: "text-secondary" },
  ];

  const courses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      code: "CS301",
      instructor: "Dr. Priya Sharma",
      semester: "6th Semester",
      progress: 85,
      grade: "A+",
      status: "active",
      nextClass: "Tomorrow 9:00 AM",
      assignments: 2,
      materials: 24,
      videos: 12,
      description:
        "Advanced data structures, algorithm analysis, and problem-solving techniques",
      materialsLink:
        "https://drive.google.com/file/d/1j1YeVU0UmTNZ3ks86TEa1KCiQsd8q9-k/view?usp=sharing",
    },
    
    {
      id: 2,
      title: "Software Engineering",
      code: "CS303",
      instructor: "Dr. Anita Singh",
      semester: "6th Semester",
      progress: 90,
      grade: "A",
      status: "active",
      nextClass: "Friday 11:00 AM",
      assignments: 0,
      materials: 32,
      videos: 15,
      description:
        "Software development lifecycle, methodologies, and project management",
      materialsLink: "https://drive.google.com/file/d/1fSX-zMg_dH1Y4_mJtgBY9DBtdNkz_mIQ/view?usp=drive_link",
    },
    {
      id: 3,
      title: "Machine Learning",
      code: "CS304",
      instructor: "Prof. Vikram Gupta",
      semester: "6th Semester",
      progress: 65,
      grade: "B+",
      status: "active",
      nextClass: "Monday 10:00 AM",
      assignments: 3,
      materials: 28,
      videos: 20,
      description:
        "Introduction to ML algorithms, neural networks, and practical applications",
      materialsLink: "https://drive.google.com/file/d/1xerMgzaFYxMcLD6GYZXROV3btw7M2Laa/view?usp=sharing",
    },
    {
      id: 4,
      title: "Operating Systems",
      code: "CS205",
      instructor: "Dr. Neha Patel",
      semester: "5th Semester",
      progress: 100,
      grade: "A+",
      status: "completed",
      nextClass: "Course Completed",
      assignments: 0,
      materials: 40,
      videos: 25,
      description:
        "Process management, memory management, and system programming",
      materialsLink:
        "https://drive.google.com/file/d/16LjH9bbJvOO-egwrpO8evFnu-TPGgrHq/view?usp=sharing",
    },
  ];

  const recentActivity = [
    {
      type: "assignment",
      course: "Machine Learning",
      activity: "Assignment 3 submitted",
      time: "2 hours ago",
    },
    {
      type: "grade",
      course: "Software Engineering",
      activity: "Project graded: A",
      time: "1 day ago",
    },
    {
      type: "material",
      course: "Database Systems",
      activity: "New lecture notes uploaded",
      time: "2 days ago",
    },
    {
      type: "announcement",
      course: "Data Structures",
      activity: "Exam schedule announced",
      time: "3 days ago",
    },
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Manage your enrolled courses, track progress, and access learning
            materials
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Class Schedule
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {courseStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-effect border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">
                              {course.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {course.code}
                            </Badge>
                            <Badge
                              variant={
                                course.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {course.status}
                            </Badge>
                            {course.grade && (
                              <Badge
                                variant="outline"
                                className="text-xs font-bold"
                              >
                                Grade: {course.grade}
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {course.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>Instructor: {course.instructor}</span>
                            <span>•</span>
                            <span>{course.semester}</span>
                            <span>•</span>
                            <span>Next: {course.nextClass}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Progress
                              </span>
                              <span className="text-sm font-medium">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div className="p-2 bg-muted/50 rounded">
                              <FileText className="w-4 h-4 mx-auto mb-1" />
                              <p>{course.materials} Materials</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded">
                              <Video className="w-4 h-4 mx-auto mb-1" />
                              <p>{course.videos} Videos</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded">
                              <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                              <p>{course.assignments} Due</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {/* Open button (kept same) */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                if (course.materialsLink) {
                                  window.open(course.materialsLink, "_blank");
                                } else {
                                  alert(
                                    "No materials link available for this course."
                                  );
                                }
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Open
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`p-1 rounded-full mt-1 ${
                        activity.type === "grade"
                          ? "bg-success/20"
                          : activity.type === "assignment"
                          ? "bg-primary/20"
                          : activity.type === "material"
                          ? "bg-secondary/20"
                          : "bg-warning/20"
                      }`}
                    >
                      {activity.type === "grade" ? (
                        <Star className="w-3 h-3 text-success" />
                      ) : activity.type === "assignment" ? (
                        <FileText className="w-3 h-3 text-primary" />
                      ) : activity.type === "material" ? (
                        <Download className="w-3 h-3 text-secondary" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.activity}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.course}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all cursor-pointer hover-lift">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Join Live Class
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Database Systems starts in 30 mins
              </p>
              <Button variant="outline" className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Join Now
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Submit Assignment
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                3 assignments pending submission
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Work
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
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Academic Goals
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track your semester targets
              </p>
              <Button variant="outline" className="w-full">
                <Award className="w-4 h-4 mr-2" />
                View Goals
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyCourses;
