// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
// import { motion } from 'framer-motion';
// import { 
//   Users, 
//   Database,
//   Settings,
//   Shield,
//   HardDrive,
//   Activity,
//   FileText,
//   Cloud,
//   Server,
//   Monitor,
//   UserPlus,
//   Trash2,
//   Eye,
//   Download,
//   Upload,
//   AlertTriangle,
//   CheckCircle2,
//   Clock
// } from 'lucide-react';

// const AdminDashboard = () => {
//   const systemStats = [
//     { icon: Users, label: 'Total Users', value: '1,456', change: '+12', color: 'text-primary' },
//     { icon: Database, label: 'Database Size', value: '2.4 GB', change: '+156 MB', color: 'text-success' },
//     { icon: HardDrive, label: 'Storage Used', value: '68%', change: '+5%', color: 'text-warning' },
//     { icon: Activity, label: 'System Health', value: '99.2%', change: '+0.1%', color: 'text-secondary' },
//   ];

//   const userManagement = [
//     { name: 'Dr. Anil Mehra', role: 'Principal', department: 'Administration', status: 'active', lastLogin: '2 hours ago' },
//     { name: 'Dr. Arvind Mehta', role: 'HOD', department: 'Computer Science', status: 'active', lastLogin: '4 hours ago' },
//     { name: 'Prof. Priya Sharma', role: 'Faculty', department: 'Computer Science', status: 'active', lastLogin: '1 hour ago' },
//     { name: 'Aarav Patel', role: 'Student', department: 'Computer Science', status: 'active', lastLogin: '30 mins ago' },
//     { name: 'Sneha Accountant', role: 'Accountant', department: 'Finance', status: 'inactive', lastLogin: '2 days ago' },
//   ];

//   const systemLogs = [
//     { type: 'info', action: 'User login', user: 'Dr. Anil Mehra', time: '10:30 AM', details: 'Successful login from 192.168.1.100' },
//     { type: 'warning', action: 'Failed login', user: 'Unknown', time: '10:25 AM', details: 'Multiple failed attempts detected' },
//     { type: 'success', action: 'Database backup', user: 'System', time: '10:00 AM', details: 'Automatic backup completed successfully' },
//     { type: 'info', action: 'File upload', user: 'Prof. Priya Sharma', time: '9:45 AM', details: 'Uploaded assignment materials (2.4 MB)' },
//   ];

//   const storageInfo = [
//     { type: 'Documents', size: '1.2 GB', percentage: 45, files: 1247 },
//     { type: 'Images', size: '580 MB', percentage: 22, files: 894 },
//     { type: 'Videos', size: '430 MB', percentage: 16, files: 67 },
//     { type: 'Other', size: '290 MB', percentage: 17, files: 203 },
//   ];

//   return (
//     <motion.div 
//       className="space-y-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <BreadcrumbNav />
      
//       {/* Welcome Section */}
//       <motion.div 
//         className="bg-gradient-hero rounded-2xl p-8 text-white"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">System Administration Portal</h1>
//             <p className="text-white/80 text-lg">
//               Complete control over CampusConnect ERP system. Monitor, manage, and maintain all operations.
//             </p>
//             <div className="flex items-center gap-4 mt-4">
//               <div className="flex items-center gap-2">
//                 <Shield className="w-5 h-5" />
//                 <span>Administrator Access</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Server className="w-5 h-5" />
//                 <span>System Status: Online</span>
//               </div>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
//               <Monitor className="w-8 h-8 mx-auto mb-2" />
//               <p className="text-sm font-medium">Uptime</p>
//               <p className="text-2xl font-bold">99.2%</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* System Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         {systemStats.map((stat, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//           >
//             <Card className="glass-effect border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover-lift">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
//                     <p className="text-3xl font-bold mt-2">{stat.value}</p>
//                     <div className="flex items-center mt-2">
//                       <Badge variant="default" className="text-xs">
//                         {stat.change}
//                       </Badge>
//                       <span className="text-xs text-muted-foreground ml-2">this week</span>
//                     </div>
//                   </div>
//                   <div className={`p-3 rounded-xl bg-gradient-primary`}>
//                     <stat.icon className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         {/* User Management */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Card className="glass-effect border-0 shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-primary" />
//                 User Management
//               </CardTitle>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm">
//                   <UserPlus className="w-4 h-4 mr-2" />
//                   Add User
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {userManagement.map((user, index) => (
//                   <motion.div 
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-1">
//                         <h4 className="font-semibold text-foreground text-sm">{user.name}</h4>
//                         <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
//                           {user.status}
//                         </Badge>
//                       </div>
//                       <p className="text-xs text-muted-foreground">{user.role} - {user.department}</p>
//                       <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
//                     </div>
//                     <div className="flex gap-1">
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                         <Eye className="w-3 h-3" />
//                       </Button>
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                         <Settings className="w-3 h-3" />
//                       </Button>
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* System Logs */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Card className="glass-effect border-0 shadow-card">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-primary" />
//                 System Logs
//               </CardTitle>
//               <Button variant="outline" size="sm">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {systemLogs.map((log, index) => (
//                   <motion.div 
//                     key={index}
//                     className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <div className={`p-1 rounded-full mt-1 ${
//                       log.type === 'success' ? 'bg-success/20' :
//                       log.type === 'warning' ? 'bg-warning/20' : 'bg-primary/20'
//                     }`}>
//                       {log.type === 'success' ? (
//                         <CheckCircle2 className="w-3 h-3 text-success" />
//                       ) : log.type === 'warning' ? (
//                         <AlertTriangle className="w-3 h-3 text-warning" />
//                       ) : (
//                         <Clock className="w-3 h-3 text-primary" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="text-sm font-medium text-foreground">{log.action}</p>
//                         <Badge variant="outline" className="text-xs">{log.time}</Badge>
//                       </div>
//                       <p className="text-xs text-muted-foreground mb-1">User: {log.user}</p>
//                       <p className="text-xs text-muted-foreground">{log.details}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Storage Management & Quick Actions */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Storage Management */}
//         <div className="xl:col-span-2">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//           >
//             <Card className="glass-effect border-0 shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle className="flex items-center gap-2">
//                   <Cloud className="w-5 h-5 text-primary" />
//                   Storage Management
//                 </CardTitle>
//                 <Button variant="outline" size="sm">
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload Files
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {storageInfo.map((storage, index) => (
//                     <motion.div 
//                       key={index}
//                       className="p-4 bg-muted/30 rounded-lg border border-border/50"
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <div className="flex justify-between items-center mb-3">
//                         <h4 className="font-semibold text-foreground">{storage.type}</h4>
//                         <Badge variant="outline" className="text-xs">{storage.files} files</Badge>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-muted-foreground">{storage.size}</span>
//                           <span className="text-sm font-medium">{storage.percentage}%</span>
//                         </div>
//                         <Progress value={storage.percentage} className="h-2" />
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           <Card className="glass-effect border-0 shadow-card">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Settings className="w-5 h-5 text-primary" />
//                 System Actions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
//                   <Database className="w-4 h-4" />
//                   Database Backup
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
//                   <Shield className="w-4 h-4" />
//                   Security Audit
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
//                   <Activity className="w-4 h-4" />
//                   Performance Monitor
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
//                   <FileText className="w-4 h-4" />
//                   Generate Reports
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
//                   <Settings className="w-4 h-4" />
//                   System Settings
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Database,
  Settings,
  Shield,
  HardDrive,
  Activity,
  FileText,
  Cloud,
  Server,
  Monitor,
  UserPlus,
  Trash2,
  Eye,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    department: "",
    semester: "",
  });

  const token = localStorage.getItem("accessToken");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast({ title: "Failed to fetch users", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_BASE}/admin/users/${editing._id}`
      : `${API_BASE}/admin/users`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast({ title: editing ? "User updated" : "User added" });
      setOpen(false);
      setEditing(null);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Student",
        department: "",
        semester: "",
      });
      fetchUsers();
    } else {
      const err = await res.json();
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
    toast({ title: "User deleted" });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <BreadcrumbNav />

      {/* User Management */}
      <Card className="glass-effect border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            User Management
          </CardTitle>
          <Button size="sm" onClick={() => setOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.role} • {u.department || "—"}
                  </p>
                  {u.role === "Student" && (
                    <p className="text-xs text-muted-foreground">
                      Semester: {u.semester || "—"}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setViewingUser(u);
                      setViewOpen(true);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(u);
                      setForm({
                        name: u.name,
                        email: u.email,
                        password: "",
                        role: u.role,
                        department: u.department || "",
                        semester: u.semester || "",
                      });
                      setOpen(true);
                    }}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(u._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            {!editing && (
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <Label>Role</Label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Faculty</option>
                <option>Student</option>
              </select>
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            {form.role === "Student" && (
              <div>
                <Label>Semester</Label>
                <Input
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {editing ? "Update User" : "Add User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewingUser.name}</p>
              <p><strong>Email:</strong> {viewingUser.email}</p>
              <p><strong>Role:</strong> {viewingUser.role}</p>
              {viewingUser.department && (
                <p><strong>Department:</strong> {viewingUser.department}</p>
              )}
              {viewingUser.semester && (
                <p><strong>Semester:</strong> {viewingUser.semester}</p>
              )}
              <p><strong>Created At:</strong> {new Date(viewingUser.createdAt).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminDashboard;
