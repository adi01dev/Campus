import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Filter, Download, UserPlus, Shield, GraduationCap, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserRecords = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    { id: "STU001", name: "Rahul Sharma", email: "rahul.s@college.edu", department: "Computer Science", year: "3rd Year", status: "Active" },
    { id: "STU002", name: "Priya Patel", email: "priya.p@college.edu", department: "Electronics", year: "2nd Year", status: "Active" },
    { id: "STU003", name: "Amit Kumar", email: "amit.k@college.edu", department: "Mechanical", year: "4th Year", status: "Active" },
  ];

  const faculty = [
    { id: "FAC001", name: "Dr. Suresh Reddy", email: "suresh.r@college.edu", department: "Computer Science", designation: "Professor", status: "Active" },
    { id: "FAC002", name: "Prof. Kavita Singh", email: "kavita.s@college.edu", department: "Electronics", designation: "Associate Professor", status: "Active" },
  ];

  const staff = [
    { id: "STF001", name: "Ramesh Verma", email: "ramesh.v@college.edu", department: "Administration", role: "Admin Officer", status: "Active" },
    { id: "STF002", name: "Sunita Rao", email: "sunita.r@college.edu", department: "Accounts", role: "Accountant", status: "Active" },
  ];

  const stats = [
    { label: "Total Students", value: "1,850", icon: GraduationCap, color: "text-blue-600" },
    { label: "Faculty Members", value: "85", icon: Briefcase, color: "text-green-600" },
    { label: "Staff Members", value: "45", icon: Users, color: "text-purple-600" },
    { label: "Active Users", value: "1,980", icon: Shield, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              User Records
            </h1>
            <p className="text-muted-foreground mt-1">Manage all user accounts and records</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={() => navigate('/manage-users')}>
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, email, or department..."
            className="pl-10 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Records Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Student Records
                </CardTitle>
                <CardDescription>Complete list of enrolled students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 font-semibold">Year</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{student.id}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{student.email}</td>
                          <td className="py-3 px-4">{student.department}</td>
                          <td className="py-3 px-4">{student.year}</td>
                          <td className="py-3 px-4">
                            <Badge variant="default">{student.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">View</Button>
                              <Button size="sm" variant="ghost">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Faculty Records
                </CardTitle>
                <CardDescription>All faculty members information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 font-semibold">Designation</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map((member) => (
                        <tr key={member.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{member.id}</td>
                          <td className="py-3 px-4">{member.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{member.email}</td>
                          <td className="py-3 px-4">{member.department}</td>
                          <td className="py-3 px-4">{member.designation}</td>
                          <td className="py-3 px-4">
                            <Badge variant="default">{member.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">View</Button>
                              <Button size="sm" variant="ghost">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Staff Records
                </CardTitle>
                <CardDescription>Administrative and support staff information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 font-semibold">Role</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((member) => (
                        <tr key={member.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{member.id}</td>
                          <td className="py-3 px-4">{member.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{member.email}</td>
                          <td className="py-3 px-4">{member.department}</td>
                          <td className="py-3 px-4">{member.role}</td>
                          <td className="py-3 px-4">
                            <Badge variant="default">{member.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">View</Button>
                              <Button size="sm" variant="ghost">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserRecords;
