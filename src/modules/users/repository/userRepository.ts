import { Socket } from 'socket.io';
import { pool } from '../../../config/db/index'
import { PoolClient } from "pg";

// Whitelisted columns for safety
const USER_COLUMNS = ['name', 'email', 'password', 'mobile', 'role', 'address', 'is'];

// Check if a specific field value exists
export const isFieldExist = async (field: string, value: any, client: PoolClient) => {
  const query = `SELECT 1 FROM users WHERE ${field} = $1 LIMIT 1`;
  const result = await pool.query(query, [value]);
  return (result.rowCount ?? 0) > 0; // true if exists, false if not
};

export const createUser = async (userData: any, client: PoolClient) => {
  const query = `INSERT INTO users(name, email, password, mobile, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const result = await pool.query(query, [userData.name, userData.email, userData.password, userData.mobile,userData.role ]);
  return result.rows[0];
};

export const getUserById = async (id: string, client: PoolClient) => {
  const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
  return result.rows[0];
};

export const updateUser = async (id: string, updates: any, client?: PoolClient) => {
  const db = client || pool;

  const validKeys = Object.keys(updates).filter(k => USER_COLUMNS.includes(k));
  if (validKeys.length === 0) throw new Error('No valid fields to update');

  const setQuery = validKeys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [id, ...validKeys.map(k => updates[k])];

  const result = await db.query(
    `UPDATE users SET ${setQuery}, updated_at = NOW() WHERE user_id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
};

// Hard Delete - permanently removes the user
export const hardDeleteUser = async (id: string, client: PoolClient) => {
  const db = client || pool;
  await db.query(`DELETE FROM users WHERE user_id = $1`, [id]);
  return true;
};

// Soft Delete - marks user as 'deactive'
export const softDeleteUser = async (id: string, client: PoolClient) => {
  const db = client || pool;
  const result = await db.query(
    `UPDATE users SET is = 'deactive', updated_at = NOW() WHERE user_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

