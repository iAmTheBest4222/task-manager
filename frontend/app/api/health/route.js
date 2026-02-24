import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  ssl: true,
  sslValidate: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000
});

export async function GET() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('Build timestamp:', new Date().toISOString());
    
    // Test database connection
    await client.connect();
    const db = client.db('taskmanager');
    await db.admin().ping(); // Test the connection
    
    return Response.json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      env: process.env.MONGODB_URI ? 'Set' : 'Not set',
      envValue: process.env.MONGODB_URI ? '***masked***' : 'null',
      database: 'Connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json({ 
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      env: process.env.MONGODB_URI ? 'Set' : 'Not set',
      envValue: process.env.MONGODB_URI ? '***masked***' : 'null',
      database: 'Connection failed',
      error: error.message
    }, { status: 500 });
  } finally {
    await client.close();
  }
}
