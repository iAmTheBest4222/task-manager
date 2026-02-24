'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '../services/api';

export default function TaskForm({ onTaskAdded, editingTask, onTaskUpdated, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    status: editingTask?.status || 'pending'
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending'
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        const updatedTask = await taskApi.updateTask(editingTask._id, formData);
        onTaskUpdated(updatedTask);
        onCancelEdit();
      } else {
        const newTask = await taskApi.createTask(formData);
        onTaskAdded(newTask);
      }
      
      setFormData({ title: '', description: '', status: 'pending' });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
        />
      </div>
      
      {editingTask && (
        <div style={{ marginBottom: '10px' }}>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        
        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
