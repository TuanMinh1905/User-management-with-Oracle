/**
 * API endpoint để test Oracle connection với user FirstTest
 * GET /api/test-oracle - Lấy danh sách Employee
 */
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function GET() {
  let connection: oracledb.Connection | null = null;

  try {
    // Kết nối với user FirstTest
    connection = await oracledb.getConnection({
      user: 'FirstTest',
      password: 'firsttest',
      connectString: 'localhost:1521/orclpdb.mshome.net',
    });

    console.log('✅ Connected to Oracle as FirstTest');

    // Query bảng Employee
    const result = await connection.execute(
      'SELECT id, ten, email FROM Employee ORDER BY id',
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return NextResponse.json({
      success: true,
      message: 'Kết nối Oracle thành công!',
      data: result.rows,
      totalRows: result.rows?.length || 0,
    });

  } catch (error: any) {
    console.error('❌ Oracle connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorCode: error.errorNum,
        hint: 'Hãy chắc chắn đã tạo user FirstTest và bảng Employee trong Oracle',
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}



