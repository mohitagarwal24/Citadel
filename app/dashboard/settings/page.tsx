'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [profile, setProfile] = useState({ name: '', email: '', role: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            if (data.user) {
                setProfile({
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                });
            }
        } catch (error) {
            setError('Failed to load profile');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profile.name }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccess('Profile updated successfully');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordLoading(true);
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords don't match");
            setIsPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            setIsPasswordLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccess('Password changed successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-lg">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings</p>
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

                {/* Profile Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your name and view account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-slate-100 dark:bg-slate-800"
                                />
                                <p className="text-xs text-slate-500">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${profile.role === 'admin'
                                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                                            : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                                        }`}>
                                        {profile.role?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Change Password
                        </CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    disabled={isPasswordLoading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    disabled={isPasswordLoading}
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-slate-500">Minimum 6 characters</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    disabled={isPasswordLoading}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button type="submit" variant="outline" disabled={isPasswordLoading}>
                                {isPasswordLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Changing Password...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
