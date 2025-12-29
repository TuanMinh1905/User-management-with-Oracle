import { NextRequest, NextResponse } from 'next/server';
import {
  getUserProfileByUsername,
  updateUserProfile,
  deleteUserProfile,
  getAllUserProfiles,
} from '@/lib/business-layer';

// GET single user by ID (username)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const username = params.id;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user = await getUserProfileByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Map to frontend format (chỉ 5 cột: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
    const mappedUser = {
      id: user.USERNAME,
      employeeId: user.USERNAME,
      fullName: user.FULL_NAME || '',
      email: user.EMAIL || '',
      phone: user.PHONE || null,
      address: user.ADDRESS || null,
      // Các field không có trong DB, set default
      position: '',
      role: 'MEMBER',
      status: 'ACTIVE',
      avatar: null,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mappedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const username = params.id;
    const body = await request.json();

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const existingUser = await getUserProfileByUsername(username);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email conflicts with other users (if email is being updated)
    if (body.email) {
      const allUsers = await getAllUserProfiles();
      const conflictUser = allUsers.find(
        (u: any) => u.USERNAME !== username && u.EMAIL === body.email
      );

      if (conflictUser) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updateData: any = {};
    if (body.fullName) updateData.full_name = body.fullName;
    if (body.email) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;

    await updateUserProfile(username, updateData);

    // Fetch updated user
    const updatedUser = await getUserProfileByUsername(username);

    // Map to frontend format (chỉ 5 cột từ DB)
    const mappedUser = {
      id: updatedUser.USERNAME,
      employeeId: updatedUser.USERNAME,
      fullName: updatedUser.FULL_NAME || '',
      email: updatedUser.EMAIL || '',
      phone: updatedUser.PHONE || null,
      address: updatedUser.ADDRESS || null,
      // Các field không có trong DB, set default
      position: '',
      role: 'MEMBER',
      status: 'ACTIVE',
      avatar: null,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mappedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const username = params.id;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const existingUser = await getUserProfileByUsername(username);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    await deleteUserProfile(username);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
