import { NextResponse } from 'next/server';
import { getAllUserProfiles } from '@/lib/business-layer';

// GET statistics
export async function GET() {
  try {
    // Đảm bảo Oracle pool đã được khởi tạo
    const { initializeOracle } = await import('@/lib/init-oracle');
    await initializeOracle().catch(() => {
      // Nếu đã khởi tạo rồi thì bỏ qua lỗi
    });

    const users = await getAllUserProfiles();

    // Map Oracle data to statistics format
    // Bảng chỉ có 5 cột: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS
    // Không có STATUS, ROLE, POSITION nên dùng default values
    const totalUsers = users.length;
    
    // Tất cả users mặc định là ACTIVE (vì không có cột STATUS)
    const activeUsers = users.length;
    const inactiveUsers = 0;
    const onLeaveUsers = 0;

    // Tất cả users mặc định là MEMBER (vì không có cột ROLE)
    const usersByRole = [{ role: 'MEMBER', count: users.length }];

    // Tất cả users không có position (vì không có cột POSITION)
    const usersByPosition = [{ position: '', count: users.length }];

    return NextResponse.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        onLeave: onLeaveUsers,
        byRole: usersByRole,
        byPosition: usersByPosition,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
