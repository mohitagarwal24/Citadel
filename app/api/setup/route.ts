import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

// Check if any admin exists
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const adminCount = await User.countDocuments({ role: 'admin' });

        return NextResponse.json({
            needsSetup: adminCount === 0,
            message: adminCount === 0
                ? 'No admin exists. Setup required.'
                : 'System is configured.',
        });
    } catch (error) {
        console.error('Setup check error:', error);
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
}

// Create first admin (only if no admin exists)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Check if any admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return NextResponse.json(
                { error: 'Setup already complete. Admin account exists.' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { name, email, password } = body;

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if email already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        // Hash password and create admin
        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({
            message: 'Admin account created successfully! You can now log in.',
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
    }
}
