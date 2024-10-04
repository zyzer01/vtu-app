import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  isEmailVerified: boolean,
  emailVerificationCode: number | null,
  emailVerificationCodeExpiry: Date | null,
  resetPasswordToken: string | null,
  resetPasswordTokenExpiry: Date | null,
  changeEmailToken: string | null,
  changeEmailTokenExpiry: Date | null,
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Invalid email'] },
  password: { type: String, required: true, min: [6, 'Password cannot be less than 6 characters'] },
  firstName: { type: String },
  lastName: { type: String },
  phone_number: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  is_active: { type: Boolean, default: true },
  isEmailVerified: {type: Boolean, default: false},
  emailVerificationCode: {type: Number},
  emailVerificationCodeExpiry: {type: Date},
  resetPasswordToken: {type: String},
  resetPasswordTokenExpiry: {type: Date},
  changeEmailToken: {type: String},
  changeEmailTokenExpiry: {type: Date},
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
