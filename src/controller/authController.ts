import { User } from '../model/userModel';
import type { NextFunction, Request, Response } from 'express';

export const login = async (req: Request, res: Response, next: NextFunction) => {
 try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (existingUser.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.status(200).json({ message: 'Login successful', user: existingUser });
 } catch (error) {
   next(error);
 }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch(error) {
    next(error);  
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}   