import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Edit,
  Camera,
  GraduationCap,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const userStr = localStorage.getItem('campusConnectUser');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return null;

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved successfully.",
      });
    }
  };

  const getRoleSpecificContent = () => {
    switch (user.role.toLowerCase()) {
      case 'student':
        return {
          stats: [
            { label: 'Current CGPA', value: '8.7', icon: GraduationCap, color: 'text-success' },
            { label: 'Semester', value: '6th', icon: Calendar, color: 'text-primary' },
            { label: 'Attendance', value: '92%', icon: Clock, color: 'text-success' },
            { label: 'Subjects', value: '6', icon: BookOpen, color: 'text-primary' }
          ],
          achievements: [
            { title: 'Dean\'s List', description: '5th Semester Academic Excellence', date: 'Dec 2023' },
            { title: 'Coding Competition Winner', description: 'IntraCollege Hackathon 2023', date: 'Nov 2023' },
            { title: 'Perfect Attendance', description: '4th Semester', date: 'May 2023' }
          ],
          recentActivities: [
            'Submitted Data Structures Assignment',
            'Attended AI/ML Seminar',
            'Participated in Code Review Session'
          ]
        };
      case 'faculty':
        return {
          stats: [
            { label: 'Teaching Experience', value: '8 yrs', icon: GraduationCap, color: 'text-primary' },
            { label: 'Subjects Teaching', value: '4', icon: BookOpen, color: 'text-primary' },
            { label: 'Student Rating', value: '4.8/5', icon: Star, color: 'text-success' },
            { label: 'Research Papers', value: '12', icon: Trophy, color: 'text-success' }
          ],
          achievements: [
            { title: 'Best Teacher Award', description: 'Excellence in Computer Science Education', date: 'Dec 2023' },
            { title: 'Research Grant', description: 'AI in Education - ₹5,00,000', date: 'Sep 2023' },
            { title: 'Published Paper', description: 'IEEE Conference on Machine Learning', date: 'Aug 2023' }
          ],
          recentActivities: [
            'Updated course curriculum for AI/ML',
            'Conducted student performance review',
            'Attended faculty development program'
          ]
        };
      case 'principal':
        return {
          stats: [
            { label: 'Total Students', value: '1,250', icon: Users, color: 'text-primary' },
            { label: 'Faculty Members', value: '85', icon: GraduationCap, color: 'text-primary' },
            { label: 'Placement Rate', value: '95%', icon: TrendingUp, color: 'text-success' },
            { label: 'Institute Rating', value: 'A+', icon: Star, color: 'text-success' }
          ],
          achievements: [
            { title: 'NAAC A+ Rating', description: 'Institutional Excellence Recognition', date: 'Jan 2024' },
            { title: 'Best Placement Record', description: 'State University Recognition', date: 'Dec 2023' },
            { title: 'Innovation Award', description: 'Educational Technology Integration', date: 'Oct 2023' }
          ],
          recentActivities: [
            'Approved new AI/ML curriculum',
            'Visited industry partnership meeting',
            'Reviewed annual budget proposals'
          ]
        };
      default:
        return {
          stats: [
            { label: 'Experience', value: '5 yrs', icon: Calendar, color: 'text-primary' },
            { label: 'Department', value: user.role, icon: Users, color: 'text-primary' },
            { label: 'Projects', value: '15', icon: BookOpen, color: 'text-success' },
            { label: 'Rating', value: '4.5/5', icon: Star, color: 'text-success' }
          ],
          achievements: [
            { title: 'Employee of the Month', description: 'Outstanding Performance', date: 'Dec 2023' },
            { title: 'Process Improvement', description: 'Streamlined Operations', date: 'Nov 2023' }
          ],
          recentActivities: [
            'Completed quarterly review',
            'Attended training workshop',
            'Updated system documentation'
          ]
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                onClick={() => toast({ title: "Coming Soon", description: "Profile picture upload feature will be available soon." })}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Mumbai, Maharashtra
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined January 2022
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleEditProfile}>
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                <Button variant="outline">
                  View Public Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-muted/50`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          {user.role.toLowerCase() === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Your semester-wise CGPA progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { semester: '1st Semester', cgpa: 8.2, progress: 82 },
                    { semester: '2nd Semester', cgpa: 8.5, progress: 85 },
                    { semester: '3rd Semester', cgpa: 8.7, progress: 87 },
                    { semester: '4th Semester', cgpa: 8.9, progress: 89 },
                    { semester: '5th Semester', cgpa: 9.1, progress: 91 },
                    { semester: '6th Semester', cgpa: 8.7, progress: 87 }
                  ].map((sem, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{sem.semester}</div>
                      <div className="flex-1">
                        <Progress value={sem.progress} className="h-2" />
                      </div>
                      <div className="w-16 text-right font-medium">{sem.cgpa}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">15th March 1998</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Blood Group</p>
                    <p className="font-medium">O+</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Father's Name</p>
                    <p className="font-medium">Ramesh Kumar</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mother's Name</p>
                    <p className="font-medium">Sunita Devi</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">+91 98765 43211</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">Andheri West, Mumbai</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Student ID</p>
                    <p className="font-medium">CSE21048</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Roll Number</p>
                    <p className="font-medium">2021048</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Branch</p>
                    <p className="font-medium">Computer Science</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Section</p>
                    <p className="font-medium">A</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Batch</p>
                    <p className="font-medium">2021-2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mentor</p>
                    <p className="font-medium">Dr. Priya Sharma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6">
            {content.achievements.map((achievement, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Trophy className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-muted-foreground mb-2">{achievement.description}</p>
                      <Badge variant="outline">{achievement.date}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest activities and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{activity}</span>
                    <Badge variant="outline" className="ml-auto">
                      {index === 0 ? '2h ago' : index === 1 ? '1d ago' : '3d ago'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Personal Information
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Change Email Address
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Upload Profile Picture
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;