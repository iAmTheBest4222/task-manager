import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(request, { params }) {
  try {
    await client.connect();
    const db = client.db('taskmanager');
    const task = await db.collection('tasks').findOne({ _id: params.id });
    
    if (!task) {
      return Response.json({ message: 'Task not found' }, { status: 404 });
    }
    
    return Response.json(task);
  } catch (error) {
    return Response.json({ message: 'Error fetching task', error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { title, description, status } = body;

    if (!title || !description) {
      return Response.json({ message: 'Title and description are required' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('taskmanager');
    
    const updateData = {
      title,
      description,
      status: status || 'pending',
      updatedAt: new Date()
    };

    const result = await db.collection('tasks').updateOne(
      { _id: params.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: 'Task not found' }, { status: 404 });
    }

    const updatedTask = await db.collection('tasks').findOne({ _id: params.id });
    return Response.json(updatedTask);
  } catch (error) {
    return Response.json({ message: 'Error updating task', error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request, { params }) {
  try {
    await client.connect();
    const db = client.db('taskmanager');
    
    const result = await db.collection('tasks').deleteOne({ _id: params.id });

    if (result.deletedCount === 0) {
      return Response.json({ message: 'Task not found' }, { status: 404 });
    }

    return Response.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return Response.json({ message: 'Error deleting task', error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
