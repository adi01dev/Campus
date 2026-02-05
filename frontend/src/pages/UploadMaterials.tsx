import { motion } from 'framer-motion';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image, Video, Download, Eye, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

const UploadMaterials = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const recentUploads = [
    {
      id: 1,
      name: 'Data Structures - Linked Lists.pdf',
      subject: 'Data Structures',
      type: 'Notes',
      size: '2.4 MB',
      uploadedBy: 'Dr. Priya Sharma',
      uploadedAt: '2024-01-08 14:30',
      downloads: 45,
      fileType: 'pdf'
    },
    {
      id: 2,
      name: 'Machine Learning Assignment 1.docx',
      subject: 'Machine Learning',
      type: 'Assignment',
      size: '856 KB',
      uploadedBy: 'Prof. Rahul Patel',
      uploadedAt: '2024-01-08 12:15',
      downloads: 23,
      fileType: 'document'
    },
    {
      id: 3,
      name: 'Digital Electronics Lab Demo.mp4',
      subject: 'Digital Electronics',
      type: 'Video Lecture',
      size: '125 MB',
      uploadedBy: 'Dr. Anita Gupta',
      uploadedAt: '2024-01-08 10:45',
      downloads: 67,
      fileType: 'video'
    },
    {
      id: 4,
      name: 'Algorithm Flowchart.png',
      subject: 'Algorithms',
      type: 'Diagram',
      size: '1.2 MB',
      uploadedBy: 'Dr. Priya Sharma',
      uploadedAt: '2024-01-08 09:20',
      downloads: 34,
      fileType: 'image'
    }
  ];

  const subjects = ['Data Structures', 'Machine Learning', 'Digital Electronics', 'Algorithms', 'Database Systems'];
  const materialTypes = ['Notes', 'Assignment', 'Video Lecture', 'Presentation', 'Diagram', 'Lab Manual'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
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
            Upload Materials
          </h1>
          <p className="text-muted-foreground mt-2">Share study materials, assignments, and resources with students</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-green-500">23</p>
                </div>
                <Upload className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-purple-500">5,642</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
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
                  <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">2.8 GB</p>
                  <p className="text-xs text-muted-foreground">of 10 GB</p>
                </div>
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upload New Material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Material Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter material title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter description (optional)" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>File Upload</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, PPT, MP4, PNG, JPG (Max 100MB)</p>
                </div>
              </div>

              <Button className="w-full glass-card">
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((file, index) => (
                  <motion.div
                    key={file.id}
                    className="p-4 border rounded-lg glass-card hover:bg-accent/50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-sm">{file.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">{file.subject}</Badge>
                              <Badge variant="secondary" className="text-xs">{file.type}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <p><span className="font-medium">Size:</span> {file.size}</p>
                            <p><span className="font-medium">Downloads:</span> {file.downloads}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Uploaded by:</span> {file.uploadedBy}</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{file.uploadedAt}</span>
                            </div>
                          </div>
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
    </motion.div>
  );
};

export default UploadMaterials;