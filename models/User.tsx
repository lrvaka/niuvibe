// models/User.ts
import mongoose, { Document, Model } from "mongoose";

// Define an interface for User document
interface IUser extends Document {
  auth0Id: string;
  name: string;
  // add other profile fields as needed
}

// Define User schema
const UserSchema = new mongoose.Schema<IUser>({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  // add other profile fields as needed
  name: {
    type: String,
    required: true,
  },
});

// Export User model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
export type { IUser };
