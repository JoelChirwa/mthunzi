import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or DATABASE_URL environment variable in .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10s timeout
      socketTimeoutMS: 45000,
    };

    console.log('Connecting to MongoDB...');
    console.log('URI host:', MONGODB_URI.split('@')[1]?.split('/')[0] || 'unknown'); // Log host only (not credentials)

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB Connected Successfully to:', mongoose.connection.name);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('❌ MongoDB Connection Failed!');
        console.error('Reason:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
