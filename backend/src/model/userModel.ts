import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },  
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
    },  
    emailVerificationTokenExpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

export const User = mongoose.model('User', userSchema);