import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const role = searchParams.get('role') || '';
    const position = searchParams.get('position') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    if (position) {
      where.position = position;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, fullName, email, phone, position, role, status, avatar, joinDate } = body;

    // Validate required fields
    if (!employeeId || !fullName || !email || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employeeId or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ employeeId }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Employee ID or Email already exists' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        employeeId,
        fullName,
        email,
        phone,
        position,
        role: role || 'MEMBER',
        status: status || 'ACTIVE',
        avatar,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
      },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
