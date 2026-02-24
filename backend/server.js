const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('Full URI value:', process.env.MONGODB_URI);
console.log('Build timestamp:', new Date().toISOString());

let db;

// Connect to MongoDB
const connectDB = async () => {
  if (db) return db;
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager');
    
    await client.connect();
    db = client.db('taskmanager');
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.MONGODB_URI ? 'Set' : 'Not set',
    envValue: process.env.MONGODB_URI ? '***masked***' : 'null'
  });
});

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const database = await connectDB();
    const tasks = await database.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const task = await database.collection('tasks').findOne({ _id: req.params.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const database = await connectDB();
    const task = {
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('tasks').insertOne(task);
    task._id = result.insertedId;
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const database = await connectDB();
    const updateData = {
      title,
      description,
      status: status || 'pending',
      updatedAt: new Date()
    };
    
    const result = await database.collection('tasks').updateOne(
      { _id: req.params.id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const updatedTask = await database.collection('tasks').findOne({ _id: req.params.id });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('tasks').deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
