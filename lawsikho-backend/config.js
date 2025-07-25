import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 5000;
export const mongoURI = process.env.MONGODB_URI;
export const JwtSECRET = process.env.JWT_SECRET;
