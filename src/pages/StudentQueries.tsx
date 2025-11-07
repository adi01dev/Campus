import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const StudentQueries = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [replyText, setReplyText] = useState('');

  const queries = [
    {
      id: 1,
      student: 'Aarav Sharma',
      rollNo: 'CSE2024001',
      subject: 'Data Structures',
      query: 'Sir, I am having difficulty understanding the concept of binary trees. Could you please explain the insertion process step by step?',
      timestamp: '2024-01-08 14:30',
      status: 'pending',
      priority: 'medium',
      category: 'academic',
      replies: []
    },
    {
      id: 2,
      student: 'Priya Patel',
      rollNo: 'CSE2024002',
      subject: 'Machine Learning',
      query: 'Madam, I missed today\'s lecture on gradient descent. Are the notes available? Also, when is the next lab session?',
      timestamp: '2024-01-08 13:15',
      status: 'resolved',
      priority: 'low',
      category: 'general',
      replies: [
        {
          from: 'Dr. Priya Sharma',
          message: 'Notes have been uploaded to the portal. Next lab is on Thursday at 2 PM.',
          timestamp: '2024-01-08 13:45'
        }
      ]
    },
    {
      id: 3,
      student: 'Rohan Gupta',
      rollNo: 'CSE2024003',
      subject: 'Database Systems',
      query: 'Sir, there seems to be an error in my assignment grades. I submitted on time but it shows as late submission.',
      timestamp: '2024-01-08 12:00',
      status: 'in_progress',
      priority: 'high',
      category: 'grades',
      replies: [
        {
          from: 'Dr. Priya Sharma',
          message: 'I\'ll check the submission timestamps and get back to you.',
          timestamp: '2024-01-08 12:30'
        }
      ]
    },
    {
      id: 4,
      student: 'Kavya Singh',
      rollNo: 'CSE2024004',
      subject: 'Algorithms',
      query: 'Madam, could you recommend some additional resources for competitive programming preparation?',
      timestamp: '2024-01-08 11:20',
      status: 'pending',
      priority: 'low',
      category: 'resources',
      replies: []
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge variant="default">Resolved</Badge>;
      case 'in_progress': return <Badge variant="secondary">In Progress</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High Priority</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
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
            Student Queries
          </h1>
          <p className="text-muted-foreground mt-2">Manage and respond to student questions and concerns</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Queries</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-500">23</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-500">18</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">2.4 hrs</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
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
            <CardTitle>Student Queries</CardTitle>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries..."
                  className="pl-10"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {queries.map((query, index) => (
                <motion.div
                  key={query.id}
                  className="p-4 border rounded-lg glass-card hover:bg-accent/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${query.student}`} />
                          <AvatarFallback>{query.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{query.student}</h3>
                            <Badge variant="outline" className="text-xs">{query.rollNo}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{query.subject}</span>
                            <span>•</span>
                            <span>{query.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(query.status)}
                        {getStatusBadge(query.status)}
                        {getPriorityBadge(query.priority)}
                      </div>
                    </div>
                    
                    <div className="pl-12">
                      <p className="text-sm mb-3">{query.query}</p>
                      
                      {query.replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {query.replies.map((reply, idx) => (
                            <div key={idx} className="bg-background/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{reply.from}</span>
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                              <p className="text-sm">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {query.status !== 'resolved' && (
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Textarea 
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                          <Button size="sm" className="glass-card">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StudentQueries;