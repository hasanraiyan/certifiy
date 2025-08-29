// src/app/admin/users/page.jsx
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useAdmin } from '@/context/admin-context'; // Import the useAdmin hook

// --- COMPONENT ---
export default function StudentManagementPage() {
    // Get state and functions from the context
    const { users, createUser, updateUser } = useAdmin();
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreatingNewUser, setIsCreatingNewUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const openCreateDrawer = () => {
        setIsCreatingNewUser(true);
        setSelectedStudent(null);
        setNewUser({ name: '', email: '' });
        setIsDrawerOpen(true);
    };

    const openDetailDrawer = (student) => {
        setIsCreatingNewUser(false);
        setSelectedStudent(student);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }
    
    const getInitials = (name) => name.match(/\b(\w)/g)?.join('').toUpperCase() || '';

    const getStatusBadgeVariant = (status) => {
        return status === 'Active' ? 'default' : 'destructive';
    }

    const handleCreateUser = () => {
        createUser(newUser);
        setIsDrawerOpen(false);
        setNewUser({ name: '', email: '' });
    };

    const handleUpdateUser = () => {
        updateUser(selectedStudent.id, selectedStudent);
        setIsDrawerOpen(false);
    };

    return (
        <>
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
                    <CardContent><p className="text-3xl font-bold">{users.length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Purchasers</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{users.filter(s => s.purchases > 0).length}</p></CardContent>
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
            <Card>
                <CardHeader>
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
                                <TableHead>Student</TableHead>
                                <TableHead>Purchases</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>LTV</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="flex items-center gap-3 py-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">{getInitials(student.name)}</div>
                                        <div>
                                            <div className="font-semibold text-foreground">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{student.purchases}</TableCell>
                                    <TableCell><Badge variant={getStatusBadgeVariant(student.status)}>{student.status}</Badge></TableCell>
                                    <TableCell className="font-medium">${student.ltv.toFixed(2)}</TableCell>
                                    <TableCell className="text-muted-foreground">{student.lastActive}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" onClick={() => openDetailDrawer(student)} className="text-primary hover:underline font-semibold p-0 h-auto">View Details</Button>
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
                                        <div className="flex gap-3 text-sm">
                                            <div className="font-semibold text-muted-foreground w-28 shrink-0">Jan 15, 2:30pm</div>
                                            <div><strong className="font-semibold">Completed</strong> Mock Exam #2 (Score: 88%)</div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <div className="font-semibold text-muted-foreground w-28 shrink-0">Jan 10, 4:15pm</div>
                                            <div><strong className="font-semibold">Purchased</strong> Full Access - Yearly</div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <div className="font-semibold text-muted-foreground w-28 shrink-0">Jan 8, 11:00am</div>
                                            <div><strong className="font-semibold">Completed</strong> Agile Practice Test (Score: 75%)</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* --- CREATE NEW USER TEMPLATE --- */}
                            <div className="bg-white p-6 border-b border-border flex-shrink-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold">Create New Student</h2>
                                        <p className="text-sm text-muted-foreground">Add a new student to the platform</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={closeDrawer}><X className="w-5 h-5" /></Button>
                                </div>
                            </div>
                            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="new-user-name">Full Name</Label>
                                        <Input 
                                            id="new-user-name"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-user-email">Email Address</Label>
                                        <Input 
                                            id="new-user-email"
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <SheetFooter className="p-6 border-t border-border flex-shrink-0">
                                <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
                                <Button onClick={handleCreateUser}>Create Student</Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
