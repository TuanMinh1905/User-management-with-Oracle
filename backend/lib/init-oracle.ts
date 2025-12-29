/**
 * Khởi tạo Oracle connection pools khi ứng dụng khởi động
 */

import { initAdminPool, closePools } from './oracle';

let initialized = false;

export async function initializeOracle() {
  if (initialized) {
    return;
  }

  try {
    await initAdminPool();
    initialized = true;
    console.log('Oracle connection pools initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Oracle connection pools:', error);
    throw error;
  }
}

export async function shutdownOracle() {
  if (!initialized) {
    return;
  }

  try {
    await closePools();
    initialized = false;
    console.log('Oracle connection pools closed');
  } catch (error) {
    console.error('Error closing Oracle connection pools:', error);
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV !== 'production') {
  initializeOracle().catch(console.error);
}



