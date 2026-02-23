import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL or use individual connection parameters
let connectionConfig;

if (process.env.DATABASE_URL) {
  // Parse MySQL connection string: mysql://user:password@host:port/database
  const url = new URL(process.env.DATABASE_URL);
  connectionConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
} else {
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmsystem', // Main database: farmsystem
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
}

// Create connection pool
const pool = mysql.createPool(connectionConfig);

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });

// Helper function to convert PostgreSQL-style parameter placeholders to MySQL
function convertParams(sql, params) {
  // If no params provided, return SQL as-is
  if (!params || params.length === 0) {
    return { sql, params: [] };
  }

  // Check if SQL already uses MySQL placeholders (?)
  if (sql.includes('?')) {
    // Already MySQL format, use params as-is
    return { sql, params };
  }

  // Convert PostgreSQL $1, $2, $3 to MySQL ?, ?, ?
  let mysqlSql = sql;
  const paramOrder = [];
  const matches = Array.from(sql.matchAll(/\$(\d+)/g));
  
  for (const match of matches) {
    const paramIndex = parseInt(match[1]) - 1;
    if (paramIndex >= 0 && paramIndex < params.length && !paramOrder.includes(paramIndex)) {
      paramOrder.push(paramIndex);
    }
  }

  // Replace $1, $2, etc. with ?
  mysqlSql = mysqlSql.replace(/\$(\d+)/g, '?');
  
  // Map parameters in order
  const mysqlParams = paramOrder.map(index => params[index]);

  return { sql: mysqlSql, params: mysqlParams };
}

// Create a wrapper to mimic pg's query interface
const poolWrapper = {
  query: async (sql, params) => {
    try {
      const { sql: mysqlSql, params: mysqlParams } = convertParams(sql, params || []);
      
      // Execute query - mysql2 execute() expects params array or undefined
      const [rows, fields] = await mysqlParams && mysqlParams.length > 0 
        ? await pool.execute(mysqlSql, mysqlParams)
        : await pool.execute(mysqlSql);
      
      // Return in pg-compatible format
      return { rows: Array.isArray(rows) ? rows : [], fields };
    } catch (error) {
      console.error('Database query error:', error);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw error;
    }
  },
  end: async () => {
    await pool.end();
  },
  getConnection: () => pool.getConnection(),
};

export default poolWrapper;




