import { pool } from '../../../config/db';
import { PoolClient } from 'pg'

export const SEARCHABLE_COLUMNS = ['name', 'email', 'mobile', 'address', 'role'];

export const getUsersCount = async (
  search: string,
  searchCols: string[],
  client?: PoolClient
): Promise<number> => {
  const db = client || pool;
  let countSql = `SELECT COUNT(*) FROM users WHERE is IS NULL OR is != 'deactive'`;
  const countValues: any[] = [];

  if (search && searchCols.length > 0) {
    const searchConditions = searchCols.map((col, idx) => `${col} ILIKE $${idx + 1}`);
    countSql += ` AND (${searchConditions.join(' OR ')})`;
    searchCols.forEach(() => countValues.push(`%${search}%`));
  }

  const countResult = await db.query(countSql, countValues);
  return Number(countResult.rows[0].count);
};

export const getUsers = async (
  search: string,
  searchCols: string[],
  fields: string[],
  orderBy: string,
  order: string,
  limit: number,
  offset: number,
  client?: PoolClient
) => {
  const db = client || pool;

  const selectFields = fields.length > 0 ? fields.join(', ') : '*';
  const orderColumn = orderBy || 'user_id';
  const orderDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let sql = `SELECT ${selectFields} FROM users WHERE is IS NULL OR is != 'deactive'`;
  const values: any[] = [];

  if (searchCols.length > 0) {
    const searchConditions = searchCols.map((col, idx) => `${col} ILIKE $${idx + 1}`);
    sql += ` AND (${searchConditions.join(' OR ')})`;
    searchCols.forEach(() => values.push(`%${search}%`));
  }

  sql += ` ORDER BY ${orderColumn} ${orderDirection} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const result = await db.query(sql, values);
  return result.rows;
};