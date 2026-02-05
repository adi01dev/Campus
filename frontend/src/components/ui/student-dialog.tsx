import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit' | 'view' | 'profile';
  student?: any;
}

export function StudentDialog({ open, onOpenChange, mode, student }: StudentDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    rollNo: student?.rollNo || '',
    email: student?.email || '',
    phone: student?.phone || '',
    class: student?.class || '',
    department: student?.department || '',
    address: student?.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === 'add' ? 'Student Added' : 'Student Updated',
      description: `${formData.name} has been ${mode === 'add' ? 'added' : 'updated'} successfully.`,
    });
    onOpenChange(false);
  };

  const isReadOnly = mode === 'view' || mode === 'profile';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Add New Student'}
            {mode === 'edit' && 'Edit Student'}
            {mode === 'view' && 'View Student Details'}
            {mode === 'profile' && 'Student Profile'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' && 'Register a new student in the institution.'}
            {mode === 'edit' && 'Update student information and records.'}
            {mode === 'view' && 'View detailed information about this student.'}
            {mode === 'profile' && 'Complete student profile and academic records.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="CSE2024001"
                  disabled={isReadOnly}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu.in"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  disabled={isReadOnly}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="BE CSE - Semester 3"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="City, State"
                disabled={isReadOnly}
                required
              />
            </div>
            {mode === 'profile' && student && (
              <div className="border-t pt-4 mt-2">
                <h4 className="font-semibold mb-3">Academic Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Attendance</p>
                    <p className="font-semibold text-lg">{student.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fee Status</p>
                    <p className="font-semibold text-lg">{student.fees}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" variant="gradient">
                {mode === 'add' ? 'Add Student' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
