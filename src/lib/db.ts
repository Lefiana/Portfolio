import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Keep this number low for serverless environments (5 is a safe max)
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Time out connection attempts after 2 seconds
});

export default pool;
