import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('taskmanager');
    const tasks = await db.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
    return Response.json(tasks);
  } catch (error) {
    return Response.json({ message: 'Error fetching tasks', error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return Response.json({ message: 'Title and description are required' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('taskmanager');
    
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
    await client.close();
  }
}
