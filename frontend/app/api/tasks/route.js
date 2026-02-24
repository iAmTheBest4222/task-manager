import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  let client;
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;
    
    const tasks = await db.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
    
    console.log('Found tasks:', tasks.length);
    return Response.json(tasks);
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ 
      message: 'Error fetching tasks', 
      error: error.message,
      uriSet: !!process.env.MONGODB_URI,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return Response.json({ message: 'Title and description are required' }, { status: 400 });
    }

    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;
    
    const task = {
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('tasks').insertOne(task);
    task._id = result.insertedId;
    
    return Response.json(task, { status: 201 });
  } catch (error) {
    return Response.json({ message: 'Error creating task', error: error.message }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
