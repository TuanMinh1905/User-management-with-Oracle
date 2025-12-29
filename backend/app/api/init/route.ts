/**
 * API endpoint để khởi tạo Oracle connection pool
 * Gọi endpoint này khi server khởi động hoặc khi cần
 */
import { NextResponse } from 'next/server';
import { initializeOracle } from '@/lib/init-oracle';

export async function GET() {
  try {
    await initializeOracle();
    return NextResponse.json({ 
      success: true, 
      message: 'Oracle connection pools initialized' 
    });
  } catch (error: any) {
    console.error('Error initializing Oracle:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to initialize Oracle' 
      },
      { status: 500 }
    );
  }
}



