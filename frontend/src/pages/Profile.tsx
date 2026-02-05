import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Use state for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          // Update local storage to keep sync
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading Profile...</div>;
  if (!user) return <div>Please log in</div>;

  // State for form inputs
  const [formData, setFormData] = useState<any>({});

  // When entering edit mode, populate form data
  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
        bloodGroup: user.bloodGroup || '',
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        emergencyContact: user.emergencyContact || '',
        bio: user.bio || '',
        gender: user.gender || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your personal information has been updated successfully.",
        });
      } else {
        toast({
          variant: 'destructive',
          title: "Update Failed",
          description: "Could not update profile. Please try again."
        });
      }
    } catch (error) {
      console.error("Profile update error", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Something went wrong."
      });
    }
  };

  const getRoleSpecificContent = () => {
    switch (user.role.toLowerCase()) {
      case 'student':
        return {
          stats: [
            { label: 'Current CGPA', value: user.cgpa || 'N/A', icon: GraduationCap, color: 'text-success' },
            { label: 'Semester', value: user.semester || 'N/A', icon: Calendar, color: 'text-primary' },
            { label: 'Attendance', value: user.attendance || '0%', icon: Clock, color: 'text-success' },
            { label: 'Subjects', value: '6', icon: BookOpen, color: 'text-primary' } // Calculated or static
          ],
          achievements: user.achievements || [
            { title: 'Joined College', description: 'Started academic journey', date: new Date(user.createdAt).toLocaleDateString() }
          ],
          recentActivities: [ // Placeholder for now or fetch activity logs
            'Logged in successfully',
            'Viewed Dashboard'
          ]
        };
      case 'faculty':
        return {
          stats: [
            { label: 'Teaching Experience', value: user.experience || 'N/A', icon: GraduationCap, color: 'text-primary' },
            { label: 'Subjects Teaching', value: user.subjects?.length?.toString() || '0', icon: BookOpen, color: 'text-primary' },
            { label: 'Student Rating', value: user.rating || 'N/A', icon: Star, color: 'text-success' },
            // Research papers - add to model if needed
            { label: 'Designation', value: user.designation || 'Faculty', icon: Trophy, color: 'text-success' }
          ],
          achievements: user.achievements || [],
          recentActivities: []
        };
      default:
        // Admin or other
        return { stats: [], achievements: [], recentActivities: [] };
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
                    {user.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {user.address ? user.address.split(',')[0] : 'Location N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={isEditing ? handleSaveProfile : handleEditToggle}>
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
                    {isEditing ? (
                      <Input name="dob" value={formData.dob} onChange={handleInputChange} placeholder="YYYY-MM-DD" />
                    ) : (
                      <p className="font-medium">{user.dob || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Blood Group</p>
                    {isEditing ? (
                      <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} placeholder="e.g. O+" />
                    ) : (
                      <p className="font-medium">{user.bloodGroup || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Father's Name</p>
                    {isEditing ? (
                      <Input name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                    ) : (
                      <p className="font-medium">{user.fatherName || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mother's Name</p>
                    {isEditing ? (
                      <Input name="motherName" value={formData.motherName} onChange={handleInputChange} />
                    ) : (
                      <p className="font-medium">{user.motherName || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Emergency Contact</p>
                    {isEditing ? (
                      <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} />
                    ) : (
                      <p className="font-medium">{user.emergencyContact || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    {isEditing ? (
                      <Textarea name="address" value={formData.address} onChange={handleInputChange} className="h-20" />
                    ) : (
                      <p className="font-medium">{user.address || 'Not Set'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bio</p>
                    {isEditing ? (
                      <Textarea name="bio" value={formData.bio} onChange={handleInputChange} className="h-20 col-span-2" />
                    ) : (
                      <p className="font-medium col-span-2">{user.bio || 'No bio added'}</p>
                    )}
                  </div>
                  {/* Editable Contact Info (Phone) - also rendered in header but useful here too */}
                  {isEditing && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <Input name="gender" value={formData.gender} onChange={handleInputChange} placeholder="Male/Female/Other" />
                    </div>
                  )}
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
                    <p className="text-muted-foreground">ID / Employee Code</p>
                    <p className="font-medium">{user.studentId || user._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{user.department || 'N/A'}</p>
                  </div>

                  {user.role === 'Student' ? (
                    <>
                      <div>
                        <p className="text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{user.rollNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Batch</p>
                        <p className="font-medium">{user.batch || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Section</p>
                        <p className="font-medium">{user.section || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mentor</p>
                        <p className="font-medium">{user.mentor || 'N/A'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-muted-foreground">Designation</p>
                        <p className="font-medium">{user.designation || 'Faculty'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Qualification</p>
                        <p className="font-medium">{user.qualification || 'N/A'}</p>
                      </div>
                    </>
                  )}
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