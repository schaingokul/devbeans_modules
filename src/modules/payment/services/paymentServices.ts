import { PoolClient } from "pg";
import * as userRepository from "../repository/paymentRepository";


export const registerServices = async(userData:any, client:PoolClient)=>{
  try {
    // const emailExists = await userRepository.isFieldExist('email', userData.email, client);
    // if(emailExists) throw new Error('Email already exists');
    // const newUser = await userRepository.createUser(userData, client);
    // if(!newUser) throw new Error('User registration failed');
    // return {success:true, message:'User registered successfully', data:newUser }
  } catch (error) {
    return{success:false, message:(error as Error).message}
  }
}