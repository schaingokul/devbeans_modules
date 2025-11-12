import { PoolClient } from "pg";
import * as userRepository from "../repository/userRepository";
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import * as userRepo from '../repository/queryRepository';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobile: Joi.string().min(10).required(),
  role: Joi.string().valid('user','admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  mobile: Joi.string(),
  role: Joi.string().valid('user','admin'),
  address: Joi.string()
});

export const registerServices = async(userData:any, client:PoolClient)=>{
  try {
    const { error, value } = registerSchema.validate(userData);
    if (error) throw new Error(error.details[0].message);

    const emailExists = await userRepository.isFieldExist('email', userData.email, client);
    if(emailExists) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const userToSave = { ...value, password: hashedPassword };

    const newUser = await userRepository.createUser(userToSave, client);
    if (!newUser) throw new Error('User registration failed');
    
    const tokens = {
    accessToken: generateAccessToken({ userId: newUser.user_id, role: newUser.role }),
    refreshToken: generateRefreshToken({ userId: newUser.user_id, role: newUser.role })
    };
  
    const { password, ...userWithoutPassword } = newUser;

    return { success: true, message: 'User registered successfully', data: userWithoutPassword, tokens };
  } catch (error) {
    return{success:false, message:(error as Error).message}
  }
}

export const loginServices = async(userData:any, client:PoolClient)=>{
  const { error, value } = loginSchema.validate(userData);
  if (error) throw new Error(error.details[0].message);

  const user = await client.query(`SELECT * FROM users WHERE email = $1`, [value.email]);
  if (!user.rows[0]) throw new Error('User not found');

  const validPassword = await bcrypt.compare(value.password, user.rows[0].password);
  if (!validPassword) throw new Error('Incorrect password');

  const tokens = {
    accessToken: generateAccessToken({ userId: user.rows[0].user_id, role: user.rows[0].role }),
    refreshToken: generateRefreshToken({ userId: user.rows[0].user_id, role: user.rows[0].role })
  };

  const { password, ...userWithoutPassword } = user.rows[0];
  return { success: true, message: 'Login successful', data: userWithoutPassword, tokens };
};

export const getUserByIdServices = async(userData:any, client:PoolClient)=>{
  const user = await userRepository.getUserById(userData.user_id, client);
  if (!user) throw new Error('User not found');
  const { password, ...userWithoutPassword } = user;
  return { success: true, data: userWithoutPassword };
};

export const updateUserByIdServices = async(userData:any, client:PoolClient)=>{
  const { error, value } = updateSchema.validate(userData.updates);
  if (error) throw new Error(error.details[0].message);

  const updatedUser = await userRepository.updateUser(userData.user_id, value, client);
  if (!updatedUser) throw new Error('Update failed');

  const { password, ...userWithoutPassword } = updatedUser;
  return { success: true, message: 'User updated successfully', data: userWithoutPassword };
};

export const softDeleteUserByIdServices = async(userData:any, client:PoolClient)=>{
  const deletedUser = await userRepository.softDeleteUser(userData.user_id, client);
  return { success: true, message: 'User soft-deleted', data: deletedUser };
};

export const hardDeleteUserByIdServices = async(userData:any, client:PoolClient)=>{
  await userRepository.hardDeleteUser(userData.user_id, client);
  return { success: true, message: 'User permanently deleted' };
};

export const listUsersService = async (queryParams: any, client?: PoolClient) => {
  const {
    search = '',
    fields = '',
    searchFields = '',
    order = 'ASC',
    orderBy = 'user_id',
    limit = 10,
    page = 1,
  } = queryParams;

  // Determine search columns
  let searchCols: string[] = [];
  if (search) {
    const searchArr = searchFields ? searchFields.split(',') : [];
    searchCols = searchArr.filter((f: any) => userRepo.SEARCHABLE_COLUMNS.includes(f));
    if (searchCols.length === 0) searchCols = [...userRepo.SEARCHABLE_COLUMNS];
  }

  // Get total count first
  const total = await userRepo.getUsersCount(search, searchCols, client);

  // If no records, return empty early
  if (total === 0) {
    return { total: 0, page: Number(page), limit: Number(limit), data: [] };
  }

  // Pagination offset
  const offset = (Number(page) - 1) * Number(limit);

  // Fields to select
  const selectFields = fields ? fields.split(',') : [];

  const data = await userRepo.getUsers(
    search,
    searchCols,
    selectFields,
    orderBy,
    order,
    Number(limit),
    offset,
    client
  );

  return { total, page: Number(page), limit: Number(limit), data };
};