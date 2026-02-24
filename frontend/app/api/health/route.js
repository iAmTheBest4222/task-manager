import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  let client;
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('Build timestamp:', new Date().toISOString());
    
    // Test database connection
    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;
    
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
    if (client) {
      await client.close();
    }
  }
}
