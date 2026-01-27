import { User } from '../model/userModel';
import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { sendVerificationEmail } from '../lib/mailer';
import { config } from '../config/config';

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

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');



      const newUser = new User({
         username, 
         email, 
         password, 
         emailVerificationToken: tokenHash, 
         emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        });
         
        await sendVerificationEmail({
          to: email,
          name: username,
          verificationLink: `${config.PORT}/verify-email?token=${verificationToken}&email=${email}`,
        })
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