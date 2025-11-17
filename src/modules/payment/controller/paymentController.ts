import { NextFunction, Request, Response } from "express";
import * as userService from "../services/paymentServices";
import { pool } from "../../../config/db";

export const registerUser = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
  const client = await pool.connect()
  try {
    client.query('BEGIN');
    // const result = await userService.registerServices(req.body, client)
    client.query('COMMIT')
  } catch (error) {
    client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
}