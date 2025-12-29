import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUserProfiles,
  createUserProfile,
  getUserProfileByUsername,
} from '@/lib/business-layer';

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Đảm bảo Oracle pool đã được khởi tạo
    const { initializeOracle } = await import('@/lib/init-oracle');
    await initializeOracle().catch(() => {
      // Nếu đã khởi tạo rồi thì bỏ qua lỗi
    });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    // Note: status, role, position không có trong database nên không dùng filter này

    let users = await getAllUserProfiles();

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter((user: any) =>
        user.FULL_NAME?.toLowerCase().includes(searchLower) ||
        user.EMAIL?.toLowerCase().includes(searchLower) ||
        user.USERNAME?.toLowerCase().includes(searchLower)
      );
    }

    // Map Oracle columns to frontend format
    // Bảng chỉ có 5 cột: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS
    const mappedUsers = users.map((user: any) => ({
      id: user.USERNAME, // Using username as ID
      employeeId: user.USERNAME,
      fullName: user.FULL_NAME || '',
      email: user.EMAIL || '',
      phone: user.PHONE || null,
      address: user.ADDRESS || null,
      // Các field này không có trong database, set default cho frontend
      position: '',
      role: 'MEMBER',
      status: 'ACTIVE',
      avatar: null,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Filter by search only (status, role, position không có trong DB nên không filter)
    let filteredUsers = mappedUsers;
    // Note: status, role, position filters không áp dụng vì không có trong database

    return NextResponse.json({ success: true, data: filteredUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    const errorMessage = error.message || 'Failed to fetch users';
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, fullName, email, phone, position, role, status, avatar, joinDate, address } = body;

    // Validate required fields
    if (!employeeId || !fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: employeeId, fullName, email' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await getUserProfileByUsername(employeeId);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Employee ID (username) already exists' },
        { status: 400 }
      );
    }

    // Create user profile in Oracle (chỉ 5 cột)
    await createUserProfile({
      username: employeeId,
      full_name: fullName,
      email: email,
      phone: phone || null,
      address: address || null,
    });

    // Fetch the created user
    const newUser = await getUserProfileByUsername(employeeId);

    // Map to frontend format (chỉ 5 cột từ DB, các field khác là default)
    const mappedUser = {
      id: newUser.USERNAME,
      employeeId: newUser.USERNAME,
      fullName: newUser.FULL_NAME || '',
      email: newUser.EMAIL || '',
      phone: newUser.PHONE || null,
      address: newUser.ADDRESS || null,
      // Các field không có trong DB, set default
      position: '',
      role: 'MEMBER',
      status: 'ACTIVE',
      avatar: null,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mappedUser }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
