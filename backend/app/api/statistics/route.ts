import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET statistics
export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    
    const activeUsers = await prisma.user.count({
      where: { status: 'ACTIVE' },
    });

    const inactiveUsers = await prisma.user.count({
      where: { status: 'INACTIVE' },
    });

    const onLeaveUsers = await prisma.user.count({
      where: { status: 'ON_LEAVE' },
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const usersByPosition = await prisma.user.groupBy({
      by: ['position'],
      _count: { position: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        onLeave: onLeaveUsers,
        byRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role,
        })),
        byPosition: usersByPosition.map(item => ({
          position: item.position,
          count: item._count.position,
        })),
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
