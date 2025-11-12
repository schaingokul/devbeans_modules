import { pool } from '../../../config/db/index'
import { PoolClient } from "pg";

// Whitelisted columns for safety
const PAYMENT_COLUMNS = ['transaction_id','user_id', 'weight_value', 'weight_unit', 'variant'
  , 'price_per_gram', 'total_amount', 'price_wt', 'payment_mode', 'status', 'created_at', 'updated_at'
 ];

export class PaymentRepository {
  private db: PoolClient | typeof pool;

  constructor(client?: PoolClient) {
    this.db = client || pool;
  }

  async createPayment(paymentData: {
    transaction_id: string|any;
    user_id: number;
    weight_value: number;
    weight_unit: string;
    variant:string;
    price_per_gram:number;
    total_amount: number;
    price_wt:number;
    payment_mode: string;
  }) {
    const query = `
      INSERT INTO payments(transaction_id, user_id, weight_value, weight_unit, variant
      ,price_per_gram, total_amount, price_wt, payment_mode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      paymentData.transaction_id,
      paymentData.user_id,
      paymentData.weight_value,
      paymentData.weight_unit,
      paymentData.variant,
      paymentData.price_per_gram,
      paymentData.total_amount,
      paymentData.price_wt,
      paymentData.payment_mode
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getPaymentById(id: number, fields?: string | string[]) {
  let result;

  if (fields) {
    // If fields is a string, make it an array
    const cols = Array.isArray(fields) ? fields : [fields];

    // Use same whitelist as in PAYMENT_COLUMNS
    const selectedCols = cols.filter(c => PAYMENT_COLUMNS.includes(c));

    if (selectedCols.length === 0) {
      throw new Error('No valid fields selected');
    }

    const query = `SELECT ${selectedCols.join(', ')} FROM payments WHERE payment_id = $1`;
    result = await this.db.query(query, [id]);
    return result.rows[0];
  }

  // If no fields specified, return all
  result = await this.db.query(`SELECT * FROM payments WHERE payment_id = $1`, [id]);
  return result.rows[0];
}

  async updatePayment(id: number, updates: Partial<{ [key: string]: any }>) {
    const validKeys = Object.keys(updates).filter(k => PAYMENT_COLUMNS.includes(k));
    if (validKeys.length === 0) throw new Error('No valid fields to update');

    const setQuery = validKeys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = [id, ...validKeys.map(k => updates[k])];

    const result = await this.db.query(
      `UPDATE payments SET ${setQuery}, updated_at = NOW() WHERE payment_id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async hardDeletePayment(id: number) {
    await this.db.query(`DELETE FROM payments WHERE payment_id = $1`, [id]);
    return true;
  }
}
