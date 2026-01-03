'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Loader2, CheckCircle2, Shield } from 'lucide-react';

export default function SetupPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        checkSetup();
    }, []);

    const checkSetup = async () => {
        try {
            const response = await fetch('/api/setup');
            const data = await response.json();

            if (data.needsSetup) {
                setNeedsSetup(true);
            } else {
                // Admin already exists, show message
                setError('Setup already complete. An admin account exists. Please log in.');
            }
        } catch (error) {
            setError('Failed to connect to database. Please check your configuration.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Setup Complete!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Redirecting to login...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
                    <ShoppingBag className="h-8 w-8 text-indigo-600" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Citadel
                    </span>
                </Link>

                <Card className="shadow-xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-full">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Initial Setup</CardTitle>
                        <CardDescription className="text-center">
                            Create the first admin account to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <p className="text-xs text-slate-500">Minimum 6 characters</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Admin...
                                    </>
                                ) : (
                                    'Create Admin Account'
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an admin account?{' '}
                            <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
