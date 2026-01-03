import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET all users (Admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        await connectDB();

        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UPDATE user role (Admin only)
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
        }

        if (!['admin', 'user'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role. Must be "admin" or "user"' }, { status: 400 });
        }

        // Prevent admin from changing their own role
        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: `User role updated to ${role}`,
            user,
        });
    } catch (error) {
        console.error('Update user role error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
