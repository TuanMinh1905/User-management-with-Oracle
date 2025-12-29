import oracledb from 'oracledb';

// Cấu hình Oracle Client
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false;

// Connection pools
let adminPool: oracledb.Pool | null = null;
let userPool: oracledb.Pool | null = null;

// Khởi tạo Admin Pool (SEC_ADMIN)
export async function initAdminPool() {
  if (adminPool) {
    return adminPool;
  }

  try {
    adminPool = await oracledb.createPool({
      user: process.env.ORACLE_ADMIN_USER || 'SEC_ADMIN',
      password: process.env.ORACLE_ADMIN_PASSWORD || 'admin123',
      connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/orclpdb.lan',
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60,
    });

    console.log('Admin pool created successfully');
    return adminPool;
  } catch (error) {
    console.error('Error creating admin pool:', error);
    throw error;
  }
}

// Khởi tạo User Pool (dùng cho user thường)
export async function initUserPool(username: string, password: string) {
  try {
    // Tạo pool động cho user
    const pool = await oracledb.createPool({
      user: username,
      password: password,
      connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/orclpdb.lan',
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1,
      poolTimeout: 60,
    });

    return pool;
  } catch (error) {
    console.error('Error creating user pool:', error);
    throw error;
  }
}

// Lấy connection từ Admin Pool
export async function getAdminConnection(): Promise<oracledb.Connection> {
  if (!adminPool) {
    await initAdminPool();
  }
  
  if (!adminPool) {
    throw new Error('Admin pool not initialized');
  }

  return await adminPool.getConnection();
}

// Lấy connection từ User Pool (tạm thời dùng admin pool, sẽ cải thiện sau)
export async function getUserConnection(username?: string, password?: string): Promise<oracledb.Connection> {
  // Nếu có username/password, tạo connection trực tiếp
  if (username && password) {
    return await oracledb.getConnection({
      user: username,
      password: password,
      connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/orclpdb.lan',
    });
  }

  // Mặc định dùng admin pool cho development
  return await getAdminConnection();
}

// Đóng tất cả pools
export async function closePools() {
  try {
    if (adminPool) {
      await adminPool.close(10);
      adminPool = null;
      console.log('Admin pool closed');
    }
    if (userPool) {
      await userPool.close(10);
      userPool = null;
      console.log('User pool closed');
    }
  } catch (error) {
    console.error('Error closing pools:', error);
  }
}

// Helper function để execute query
export async function executeQuery<T = any>(
  sql: string,
  binds: any = {},
  options: oracledb.ExecuteOptions = {}
): Promise<oracledb.Result<T>> {
  let connection: oracledb.Connection | null = null;
  try {
    connection = await getAdminConnection();
    const result = await connection.execute<T>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    });
    await connection.commit();
    return result;
  } catch (error: any) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error executing query:', sql);
    console.error('Binds:', binds);
    console.error('Error details:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
  }
}

// Helper function để execute PL/SQL procedure
export async function executeProcedure(
  packageName: string,
  procedureName: string,
  params: any = {}
): Promise<any> {
  const connection = await getAdminConnection();
  try {
    const bindNames = Object.keys(params);
    const bindValues = Object.values(params);
    
    let sql = `BEGIN ${packageName}.${procedureName}(`;
    const binds: any = {};
    
    bindNames.forEach((name, index) => {
      if (index > 0) sql += ', ';
      sql += `:${name}`;
      binds[name] = bindValues[index];
    });
    
    sql += '); END;';
    
    const result = await connection.execute(sql, binds);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.close();
  }
}

