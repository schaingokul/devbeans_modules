import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userServices";
import { pool } from "../../../config/db";

export const registerUser = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.registerServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
}

export const loginUser = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.loginServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
};

export const getUserById = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.getUserByIdServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
};

export const updateUserById = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.updateUserByIdServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
};

export const softDeleteUserById = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.softDeleteUserByIdServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
};

export const hardDeleteUserById = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await userService.softDeleteUserByIdServices(req.body, client)
    
    await client.query('COMMIT')
    res.status(201).json(result)

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  try {
    const result = await userService.listUsersService(req.query, client);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};