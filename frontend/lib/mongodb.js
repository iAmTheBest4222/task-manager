import { MongoClient } from 'mongodb';

const sslConfigs = [
  {
    // Most permissive - for Vercel
    ssl: true,
    sslValidate: false,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  },
  {
    // Standard SSL
    ssl: true,
    sslValidate: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  },
  {
    // Minimal SSL
    ssl: true,
  }
];

const baseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  maxPoolSize: 1,
  minPoolSize: 0
};

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  let lastError;
  
  // Try different SSL configurations
  for (const sslConfig of sslConfigs) {
    try {
      const client = new MongoClient(uri, {
        ...baseOptions,
        ...sslConfig
      });
      
      await client.connect();
      const db = client.db('taskmanager');
      
      // Test the connection
      await db.admin().ping();
      
      console.log('MongoDB connected successfully with SSL config:', sslConfig);
      return { client, db };
      
    } catch (error) {
      console.log('Failed SSL config:', sslConfig, 'Error:', error.message);
      lastError = error;
    }
  }
  
  // If all configurations fail, throw the last error
  throw lastError || new Error('Failed to connect to MongoDB with any SSL configuration');
}
