/**
 * Business Layer - Gọi PL/SQL Package và truy vấn system views
 * Không hardcode quyền, không tự đánh giá allow/deny
 */

import { getAdminConnection, getUserConnection, executeQuery, executeProcedure } from './oracle';
import oracledb from 'oracledb';

// ========== USER MANAGEMENT (gọi PL/SQL Package) ==========

export async function createUser(
  username: string,
  password: string,
  tablespace: string = 'TS_APP_DATA',
  quota: string = '20M'
) {
  return await executeProcedure('APP_OWNER.PKG_USER_ADMIN', 'CREATE_USER', {
    p_username: username,
    p_password: password,
    p_tablespace: tablespace,
    p_quota: quota,
  });
}

export async function lockUser(username: string) {
  return await executeProcedure('APP_OWNER.PKG_USER_ADMIN', 'LOCK_USER', {
    p_username: username,
  });
}

export async function unlockUser(username: string) {
  return await executeProcedure('APP_OWNER.PKG_USER_ADMIN', 'UNLOCK_USER', {
    p_username: username,
  });
}

// ========== QUERY SYSTEM VIEWS (Admin) ==========

export async function getDbaUsers() {
  const result = await executeQuery('SELECT * FROM dba_users ORDER BY username');
  return result.rows;
}

export async function getDbaRoles() {
  const result = await executeQuery('SELECT * FROM dba_roles ORDER BY role');
  return result.rows;
}

export async function getDbaRolePrivs() {
  const result = await executeQuery('SELECT * FROM dba_role_privs ORDER BY grantee, granted_role');
  return result.rows;
}

export async function getDbaSysPrivs() {
  const result = await executeQuery('SELECT * FROM dba_sys_privs ORDER BY grantee, privilege');
  return result.rows;
}

export async function getDbaProfiles() {
  const result = await executeQuery('SELECT * FROM dba_profiles ORDER BY profile');
  return result.rows;
}

// ========== QUERY SYSTEM VIEWS (Regular User) ==========

export async function getUserUsers(username: string, password: string) {
  const connection = await getUserConnection(username, password);
  try {
    const result = await connection.execute('SELECT * FROM user_users');
    return result.rows;
  } finally {
    await connection.close();
  }
}

export async function getUserRolePrivs(username: string, password: string) {
  const connection = await getUserConnection(username, password);
  try {
    const result = await connection.execute('SELECT * FROM user_role_privs');
    return result.rows;
  } finally {
    await connection.close();
  }
}

export async function getUserTabPrivs(username: string, password: string) {
  const connection = await getUserConnection(username, password);
  try {
    const result = await connection.execute('SELECT * FROM user_tab_privs');
    return result.rows;
  } finally {
    await connection.close();
  }
}

// ========== APP_USER_PROFILE TABLE OPERATIONS ==========

export async function getAllUserProfiles() {
  try {
    const result = await executeQuery('SELECT * FROM APP_OWNER.APP_USER_PROFILE ORDER BY USERNAME');
    return result.rows || [];
  } catch (error: any) {
    console.error('Error in getAllUserProfiles:', error);
    // Nếu table chưa tồn tại, trả về mảng rỗng thay vì throw error
    if (error.errorNum === 942 || error.message?.includes('does not exist')) {
      console.warn('Table APP_USER_PROFILE does not exist yet. Returning empty array.');
      return [];
    }
    throw error;
  }
}

export async function getUserProfileByUsername(username: string) {
  const result = await executeQuery(
    'SELECT * FROM APP_OWNER.APP_USER_PROFILE WHERE USERNAME = :username',
    { username }
  );
  return result.rows?.[0] || null;
}

export async function createUserProfile(data: {
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  const result = await executeQuery(
    `INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
     VALUES (:username, :full_name, :email, :phone, :address)`,
    data
  );
  return result;
}

export async function updateUserProfile(username: string, data: {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const updates: string[] = [];
  const binds: any = { username };

  if (data.full_name) {
    updates.push('FULL_NAME = :full_name');
    binds.full_name = data.full_name;
  }
  if (data.email) {
    updates.push('EMAIL = :email');
    binds.email = data.email;
  }
  if (data.phone !== undefined) {
    updates.push('PHONE = :phone');
    binds.phone = data.phone;
  }
  if (data.address !== undefined) {
    updates.push('ADDRESS = :address');
    binds.address = data.address;
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  const sql = `UPDATE APP_OWNER.APP_USER_PROFILE SET ${updates.join(', ')} WHERE USERNAME = :username`;
  const result = await executeQuery(sql, binds);
  return result;
}

export async function deleteUserProfile(username: string) {
  const result = await executeQuery(
    'DELETE FROM APP_OWNER.APP_USER_PROFILE WHERE USERNAME = :username',
    { username }
  );
  return result;
}

// ========== VIEW OPERATIONS ==========

export async function getUserContactView() {
  const result = await executeQuery('SELECT * FROM APP_OWNER.VW_USER_CONTACT ORDER BY USERNAME');
  return result.rows;
}

