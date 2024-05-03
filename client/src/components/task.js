import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './task.module.css';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../actions/taskActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tasks = ({ tasks, loading, fetchTasks, addTask, updateTask, deleteTask }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
    });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [disabledButtons, setDisabledButtons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            navigate('/login');
        } else {
            console.log(fetchTasks())
            fetchTasks();
        
        }
    }, [navigate, fetchTasks]);
    useEffect(() => {
        console.log(tasks); 
        console.log(loading); 
    }, [tasks, loading]);
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCancelEdit = (index) => {
        setEditingTaskId(null);
        setFormData({ title: '', description: '', priority: 'Medium' });
    };

    const handleEditTask = (task, index) => {
        setEditingTaskId(task['_id']);
        setFormData({
            title: task.title,
            description: task.description,
            priority: task.priority || 'Medium',
        });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await addTask(formData);
            setFormData({ title: '', description: '', priority: 'Medium' });
            fetchTasks();
            toast.success('Task added successfully');
        } catch (error) {
            console.error('Error adding task:', error.message);
            toast.error('Error adding task');
        }
    };

    const handleUpdateTask = async (userId, taskId) => { 
        try {
            await updateTask(userId, taskId, { ...formData, taskId: editingTaskId });
            fetchTasks();
            setEditingTaskId(null);
            setFormData({ title: '', description: '', priority: 'Medium' });
            toast.success('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error.message);
            toast.error('Error updating task');
        }
    };

   const handleDeleteTask = async (userId, taskId) => {
    try {
        await deleteTask(userId, taskId);
        fetchTasks();
        toast.success('Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error.message);
        toast.error('Error deleting task');
    }
};

    const priorityStyle = (priority) => {
        switch (priority) {
            case 'High':
                return styles.highPriority;
            case 'Medium':
                return styles.mediumPriority;
            case 'Low':
                return styles.lowPriority;
            default:
                return '';
        }
    };

    return (
        <div className={styles.main}>
            <h2 className={styles.h2}>Tasks</h2>
            <button style={{ position: 'absolute', right: '50px', top: '50px' }} className={styles.button} onClick={handleLogout}>
                Logout
            </button>
            <form className={styles.form} onSubmit={handleAddTask}>
                <input
                    className={styles.input}
                    placeholder='title'
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <br />
                <input
                    className={styles.input}
                    placeholder='description'
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
                <br />
                <select
                    className={styles.input}
                    name='priority'
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    required
                >
                    <option value='High'>High</option>
                    <option value='Medium'>Medium</option>
                    <option value='Low'>Low</option>
                </select>
                <br />
                
                <button className={styles.button} type='submit'>
                    Add Task
                </button>
            </form>
            {loading ? (
                <p style={{ fontSize: '16px', color: '#555', textAlign: 'center', marginTop: '20px' }}>Loading tasks...</p>
            ) : (
                <ul className={styles.ul}>
                    {tasks && tasks.map((task, index) => (
                        <li className={`${styles.cards} ${priorityStyle(task.priority)}`} key={task._id}>
                            {editingTaskId === task['_id'] ? (
                                <div className={styles.card}>
                                    <input
                                        className={styles.input}
                                        type='text'
                                        name='title'
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                    <br />
                                    <input
                                        className={styles.input}
                                        type='text'
                                        name='description'
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <br />
                                    <select
                                        className={styles.input}
                                        name='priority'
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        required
                                    >
                                        <option value='High'>High</option>
                                        <option value='Medium'>Medium</option>
                                        <option value='Low'>Low</option>
                                    </select>
                                    <br />
                                    <button style={{ width: '100%', minWidth: '5vw' }} className={styles.button} onClick={() => handleUpdateTask(task.userId, task['_id'])}>
                                        Update Task
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.task}>
                                    <div>
                                        <strong className={styles['info-label']}>Title:</strong>
                                        <p>{task.title}</p>
                                    </div>
                                    <div>
                                        <strong className={styles['info-label']}>Description:</strong>
                                        <p>{task.description}</p>
                                    </div>
                                    <div>
                                        <strong className={styles['info-label']}>Priority:</strong>
                                        <p>{task.priority}</p>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                                <div>
                                    {!disabledButtons[index] && (
                                        <button className={styles.button} style={{ width: '100%', minWidth: '5vw' }} onClick={() => handleEditTask(task, index)}>
                                            Edit
                                        </button>
                                    )}
                                </div>
                                <button className={styles.button} style={{ width: '100%', minWidth: '5vw' }} onClick={() => handleDeleteTask(task.userId, task['_id'])}>
                                    Delete
                                </button>
                                {disabledButtons[index] && (
                                    <button style={{ width: '100%', minWidth: '5vw' }} className={styles.button} onClick={() => handleCancelEdit(index)}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <ToastContainer />
        </div>
    );

};

const mapStateToProps = (state) => ({
    tasks: state.tasks,
    loading: state.loading,
});

export default connect(mapStateToProps, { fetchTasks, addTask,updateTask,deleteTask})(Tasks);
