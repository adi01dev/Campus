import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { UserDialog } from '@/components/ui/user-dialog';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  Mail,
  Phone
} from 'lucide-react';

const ManageUsers = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const userStats = [
    { title: 'Total Users', value: '1,456', icon: Users, color: 'text-primary' },
    { title: 'Active Users', value: '1,289', icon: CheckCircle, color: 'text-success' },
    { title: 'Inactive Users', value: '89', icon: XCircle, color: 'text-warning' },
    { title: 'Pending Approval', value: '78', icon: Clock, color: 'text-secondary' },
  ];

  const users = [
    { 
      id: 1, 
      name: 'Dr. Anil Mehra', 
      email: 'anil.mehra@college.edu.in', 
      role: 'Principal', 
      department: 'Administration', 
      status: 'active', 
      lastLogin: '2 hours ago',
      phone: '+91 98765 43210'
    },
    { 
      id: 2, 
      name: 'Dr. Arvind Mehta', 
      email: 'arvind.mehta@college.edu.in', 
      role: 'HOD', 
      department: 'Computer Science', 
      status: 'active', 
      lastLogin: '4 hours ago',
      phone: '+91 98765 43211'
    },
    { 
      id: 3, 
      name: 'Prof. Priya Sharma', 
      email: 'priya.sharma@college.edu.in', 
      role: 'Faculty', 
      department: 'Computer Science', 
      status: 'active', 
      lastLogin: '1 hour ago',
      phone: '+91 98765 43212'
    },
    { 
      id: 4, 
      name: 'Aarav Patel', 
      email: 'aarav.patel@student.college.edu.in', 
      role: 'Student', 
      department: 'Computer Science', 
      status: 'active', 
      lastLogin: '30 mins ago',
      phone: '+91 98765 43213'
    },
    { 
      id: 5, 
      name: 'Sneha Accountant', 
      email: 'sneha@college.edu.in', 
      role: 'Accountant', 
      department: 'Finance', 
      status: 'inactive', 
      lastLogin: '2 days ago',
      phone: '+91 98765 43214'
    },
    { 
      id: 6, 
      name: 'Rajesh Kumar', 
      email: 'rajesh.kumar@college.edu.in', 
      role: 'Faculty', 
      department: 'Electronics', 
      status: 'pending', 
      lastLogin: 'Never',
      phone: '+91 98765 43215'
    },
  ];

  const roleColors = {
    Principal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    HOD: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Faculty: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Student: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Accountant: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage all system users, roles, and permissions across the institution
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Users
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="gradient"
            onClick={() => {
              setDialogMode('add');
              setSelectedUser(null);
              setDialogOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
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
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-primary">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-effect border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users by name, email, or role..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Role
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-effect border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user, index) => (
                <motion.div 
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* User Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-foreground">{user.name}</h4>
                        <Badge 
                          className={roleColors[user.role as keyof typeof roleColors]}
                        >
                          {user.role}
                        </Badge>
                        <Badge 
                          variant={
                            user.status === 'active' ? 'default' : 
                            user.status === 'inactive' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Last login: {user.lastLogin}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        Department: {user.department}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover-lift"
                      onClick={() => {
                        setDialogMode('view');
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover-lift"
                      onClick={() => {
                        setDialogMode('edit');
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover-lift"
                      onClick={() => {
                        toast({
                          title: 'Permissions',
                          description: 'Manage user permissions and access rights.',
                        });
                      }}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover-lift text-destructive"
                      onClick={() => {
                        toast({
                          title: 'Delete User',
                          description: `Are you sure you want to delete ${user.name}?`,
                          variant: 'destructive',
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Bulk User Import</h3>
              <p className="text-sm text-muted-foreground mb-4">Import multiple users via CSV file</p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Role Management</h3>
              <p className="text-sm text-muted-foreground mb-4">Configure roles and permissions</p>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Manage Roles
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
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Export Users</h3>
              <p className="text-sm text-muted-foreground mb-4">Download user data and reports</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={selectedUser}
      />
    </motion.div>
  );
};

export default ManageUsers;