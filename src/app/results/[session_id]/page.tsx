
'use client';

import { useState, useMemo } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

// --- TYPES AND MOCK DATA ---
interface Student {
  id: number;
  name: string;
  email: string;
  plan: 'Free' | 'Full Access';
  status: 'Active' | 'Suspended';
  ltv: number;
  lastActive: string;
  joinDate: string;
}

const mockStudents: Student[] = [
  { id: 1, name: 'John Student', email: 'student@example.com', plan: 'Full Access', status: 'Active', ltv: 279.00, lastActive: '2h ago', joinDate: '3 months ago' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', plan: 'Free', status: 'Active', ltv: 0.00, lastActive: '1d ago', joinDate: '1 month ago' },
  { id: 3, name: 'Michael Chen', email: 'michael.chen@example.com', plan: 'Full Access', status: 'Suspended', ltv: 49.00, lastActive: '3w ago', joinDate: '6 months ago' },
  { id: 4, name: 'Emily Rodriguez', email: 'emily.r@example.com', plan: 'Full Access', status: 'Active', ltv: 279.00, lastActive: '5h ago', joinDate: '2 weeks ago' },
  { id: 5, name: 'David Lee', email: 'david.lee@example.com', plan: 'Free', status: 'Active', ltv: 0.00, lastActive: '2d ago', joinDate: '1 week ago' },
];

const activityFeed = [
    { date: 'Jan 15, 2:30pm', action: 'Completed', details: 'Mock Exam #2 (Score: 88%)' },
    { date: 'Jan 10, 4:15pm', action: 'Purchased', details: 'Full Access - Yearly' },
    { date: 'Jan 8, 11:00am', action: 'Completed', details: 'Agile Practice Test (Score: 75%)' },
];

const plans = ['Free', 'Full Access'];

// --- COMPONENT ---
export default function StudentManagementPage() {
    const [students] = useState<Student[]>(mockStudents);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreatingNewUser, setIsCreatingNewUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', plan: 'Free' as 'Free' | 'Full Access' });

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        return students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const openCreateDrawer = () => {
        setIsCreatingNewUser(true);
        setSelectedStudent(null);
        setNewUser({ name: '', email: '', plan: 'Free' });
        setIsDrawerOpen(true);
    };

    const openDetailDrawer = (student: Student) => {
        setIsCreatingNewUser(false);
        setSelectedStudent(student);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => setIsDrawerOpen(false);
    
    const getInitials = (name: string) => name.match(/\b(\w)/g)?.join('').toUpperCase() || '';
    
    // Updated functions to provide correct variants for badges
    const getPlanBadgeVariant = (plan: Student['plan']) => (plan === 'Free' ? 'secondary' : 'default');
    const getStatusBadgeVariant = (status: Student['status']) => (status === 'Active' ? 'default' : 'destructive');

    return (
        <AuthGuard allowedRoles={['admin', 'super_admin']}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
                    <p className="mt-1 text-muted-foreground">View, manage, and support your students.</p>
                </div>
                <Button onClick={openCreateDrawer} className="w-full sm:w-auto">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Student
                </Button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{students.length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Subscribers</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{students.filter(s => s.plan !== 'Free').length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">New This Month</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">12</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg. Tests Taken</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">8.4</p></CardContent>
                </Card>
            </div>

            {/* Student Directory Table */}
            <Card className='p-0 m-0'>
                <CardHeader className='p-0 m-0'>
                    <Input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..." 
                        className="w-full max-w-sm"
                    />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">Student</TableHead>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">Plan</TableHead>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">Status</TableHead>
                                <TableHead className="px-4 py-3.5 text-right text-sm font-medium text-muted-foreground">LTV</TableHead>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">Last Active</TableHead>
                                <TableHead className="relative px-4 py-3.5"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="px-4 py-3 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">{getInitials(student.name)}</div>
                                            <div>
                                                <div className="font-medium text-foreground">{student.name}</div>
                                                <div className="text-xs text-muted-foreground">{student.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle"><Badge variant={getPlanBadgeVariant(student.plan)}>{student.plan}</Badge></TableCell>
                                    <TableCell className="px-4 py-3 align-middle"><Badge variant={getStatusBadgeVariant(student.status)}>{student.status}</Badge></TableCell>
                                    <TableCell className="px-4 py-3 text-right align-middle font-mono text-sm tabular-nums text-foreground">${student.ltv.toFixed(2)}</TableCell>
                                    <TableCell className="px-4 py-3 align-middle text-muted-foreground text-sm">{student.lastActive}</TableCell>
                                    <TableCell className="px-4 py-3 text-right align-middle">
                                        <Button variant="ghost" size="sm" onClick={() => openDetailDrawer(student)}>View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Editor/Detail Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="w-full max-w-xl sm:max-w-xl p-0 flex flex-col bg-muted/30">
                    {!isCreatingNewUser && selectedStudent ? (
                        <>
                            {/* --- VIEW DETAILS TEMPLATE --- */}
                            <div className="bg-white p-6 border-b border-border flex-shrink-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                            {getInitials(selectedStudent.name)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                                            <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={closeDrawer}><X className="w-5 h-5" /></Button>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    <Button variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20">Suspend User</Button>
                                    <Button variant="secondary">Send Password Reset</Button>
                                </div>
                            </div>
                            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <Card className="p-3"><p className="text-xs text-muted-foreground">LTV</p><p className="font-bold text-lg">${selectedStudent.ltv.toFixed(2)}</p></Card>
                                    <Card className="p-3"><p className="text-xs text-muted-foreground">Avg. Score</p><p className="font-bold text-lg">82%</p></Card>
                                    <Card className="p-3"><p className="text-xs text-muted-foreground">Tests Taken</p><p className="font-bold text-lg">14</p></Card>
                                    <Card className="p-3"><p className="text-xs text-muted-foreground">Joined</p><p className="font-bold text-lg">{selectedStudent.joinDate}</p></Card>
                                </div>
                                <Card>
                                    <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {activityFeed.map((activity, index) => (
                                            <div key={index} className="flex gap-3 text-sm">
                                                <div className="font-semibold text-muted-foreground w-28 shrink-0">{activity.date}</div>
                                                <div><strong className="font-semibold">{activity.action}</strong> {activity.details}</div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Manage Account</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="plan" className="font-medium text-sm">Change Plan</Label>
                                            <Select defaultValue={selectedStudent.plan}>
                                                <SelectTrigger id="plan" className="w-full mt-1 bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {plans.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="font-medium text-sm">Admin Notes</Label>
                                            <Textarea rows={3} className="w-full mt-1 bg-white" placeholder="Add internal notes for this user..." />
                                        </div>
                                        <Button className="bg-primary/10 text-primary hover:bg-primary/20">Save Changes</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* --- CREATE NEW USER TEMPLATE --- */}
                            <SheetHeader className="bg-white p-6 border-b border-border flex-shrink-0 flex flex-row justify-between items-center">
                                <SheetTitle className="text-2xl font-bold">Add New Student</SheetTitle>
                                <Button variant="ghost" size="icon" onClick={closeDrawer}><X className="w-5 h-5" /></Button>
                            </SheetHeader>
                            <div className="flex-grow p-8 space-y-6 overflow-y-auto">
                                <div><Label htmlFor="newName" className="font-medium text-sm">Full Name</Label><Input type="text" id="newName" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full mt-1" placeholder="John Doe" /></div>
                                <div><Label htmlFor="newEmail" className="font-medium text-sm">Email Address</Label><Input type="email" id="newEmail" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full mt-1" placeholder="john.doe@example.com" /></div>
                                <div>
                                    <Label htmlFor="newPlan" className="font-medium text-sm">Assign Plan</Label>
                                    <Select value={newUser.plan} onValueChange={(value: 'Free' | 'Full Access') => setNewUser({...newUser, plan: value})}>
                                        <SelectTrigger id="newPlan" className="w-full mt-1 bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {plans.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-3 pt-2"><Checkbox id="sendInvite" /><Label htmlFor="sendInvite" className="text-sm font-normal text-muted-foreground">Send welcome email with password setup link</Label></div>
                            </div>
                            <SheetFooter className="bg-white p-4 border-t border-border flex-shrink-0 flex justify-end gap-4">
                                <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
                                <Button>Create Student</Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </AuthGuard>
    );
}
