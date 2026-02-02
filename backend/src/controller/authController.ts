import { User } from '../model/userModel';
import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { sendVerificationEmail } from '../lib/mailer';
import { config } from '../config/config';
import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  const token = jwt.sign(
      { sub: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    const user = {
      id: existingUser._id,
      email: existingUser.email,
    }

    return res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Login successful',
    })  } catch (error) {
    next(error);
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await newUser.save();


    await sendVerificationEmail({
      to: email,
      subject: 'Verify you email',
      verificationLink: `${config.APP_URL}/verify-email?token=${verificationToken}&email=${email}`,
    })
    res.status(201).json({
      success: true,
      data: null,
      message: 'Registration successful. Check your email to verify.',
    });
  } catch (error) {
    next(error);
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, email } = req.body;

    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      email,
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      data: null,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string }
    const user = await User.findById(payload.sub).select('_id email roles')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      data: { id: user._id, email: user.email, roles: user.role },
    })
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}