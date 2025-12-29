/**
 * API endpoint để test Oracle connection
 * GET /api/test-oracle
 */
import { NextResponse } from 'next/server';
import { initializeOracle } from '@/lib/init-oracle';
import { executeQuery } from '@/lib/oracle';

export async function GET() {
  try {
    // Khởi tạo Oracle pool
    await initializeOracle();
    
    // Test query đơn giản
    const result = await executeQuery('SELECT 1 as test FROM DUAL');
    
    // Test query table (nếu có)
    let tableExists = false;
    let userCount = 0;
    try {
      const tableResult = await executeQuery('SELECT COUNT(*) as CNT FROM APP_OWNER.APP_USER_PROFILE');
      tableExists = true;
      userCount = (tableResult.rows?.[0] as any)?.CNT || 0;
    } catch (tableError: any) {
      tableExists = false;
      console.log('Table does not exist yet:', tableError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Oracle connection is working',
      data: {
        connection: 'OK',
        testQuery: result.rows,
        tableExists,
        userCount,
      },
    });
  } catch (error: any) {
    console.error('Oracle test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to Oracle',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          errorNum: error.errorNum,
          code: error.code,
        } : undefined,
      },
      { status: 500 }
    );
  }
}



