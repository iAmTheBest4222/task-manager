'use client';

import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { taskApi } from '../services/api';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskApi.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Task Manager</h1>
      
      <TaskForm
        onTaskAdded={handleTaskAdded}
        onTaskUpdated={handleTaskUpdated}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Tasks</h2>
        <TaskList
          tasks={tasks}
          onTaskEdit={handleTaskEdit}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
    </div>
  );
}
