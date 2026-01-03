'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Users, Shield, ShieldOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        user: User | null;
        action: 'grant' | 'revoke';
    }>({ open: false, user: null, action: 'grant' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            setError('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async () => {
        if (!confirmDialog.user) return;

        const userId = confirmDialog.user._id;
        const newRole = confirmDialog.action === 'grant' ? 'admin' : 'user';

        setActionLoading(userId);
        setError('');
        setSuccess('');
        setConfirmDialog({ open: false, user: null, action: 'grant' });

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccess(data.message);
                // Update local state
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, role: newRole } : u
                ));
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setActionLoading(null);
        }
    };

    const openConfirmDialog = (user: User, action: 'grant' | 'revoke') => {
        setConfirmDialog({ open: true, user, action });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage user roles and permissions</p>
                    </div>
                </div>

                {/* Messages */}
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                            <CardContent className="p-4 flex items-center space-x-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <p className="text-green-800 dark:text-green-300">{success}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                            <CardContent className="p-4 flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="text-red-800 dark:text-red-300">{error}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            Grant or revoke admin privileges for users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                        ) : users.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className="border-b"
                                        >
                                            <TableCell className="font-medium dark:text-white">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-400">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    user.role === 'admin'
                                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                                }>
                                                    {user.role.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {actionLoading === user._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin inline" />
                                                ) : user.role === 'admin' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openConfirmDialog(user, 'revoke')}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <ShieldOff className="h-4 w-4 mr-1" />
                                                        Revoke Admin
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openConfirmDialog(user, 'grant')}
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    >
                                                        <Shield className="h-4 w-4 mr-1" />
                                                        Grant Admin
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No users found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmDialog.action === 'grant' ? 'Grant Admin Privileges' : 'Revoke Admin Privileges'}
                        </DialogTitle>
                        <DialogDescription>
                            {confirmDialog.action === 'grant' ? (
                                <>
                                    Are you sure you want to grant admin privileges to <strong>{confirmDialog.user?.name}</strong>?
                                    They will have full access to all dashboard features.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to revoke admin privileges from <strong>{confirmDialog.user?.name}</strong>?
                                    They will lose access to admin features.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRoleChange}
                            className={confirmDialog.action === 'grant'
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }
                        >
                            {confirmDialog.action === 'grant' ? (
                                <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Grant Admin
                                </>
                            ) : (
                                <>
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Revoke Admin
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
