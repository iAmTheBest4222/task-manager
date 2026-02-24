'use client';

import { taskApi } from '../services/api';

export default function TaskList({ tasks, onTaskEdit, onTaskDeleted, onTaskUpdated }) {
  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        onTaskDeleted(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedTask = await taskApi.updateTask(taskId, {
        title: task.title,
        description: task.description,
        status: newStatus
      });
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in-progress':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No tasks found. Add your first task above!</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{task.title}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.4' }}>{task.description}</p>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(task.status),
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
                <button
                  onClick={() => onTaskEdit(task)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
