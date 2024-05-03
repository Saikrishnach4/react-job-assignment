// actions/taskActions.js
import axios from 'axios';

export const fetchTasks = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_TASKS_REQUEST' }); // Optional: Dispatch request action
        const response = await axios.get(`http://localhost:5000/tasks/${localStorage.getItem('userId')}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: response.data });
        console.log(response.data)
    } catch (error) {
        dispatch({ type: 'FETCH_TASKS_FAILURE', payload: error.message });
    }
};

export const addTask = (formData) => async (dispatch) => {
    try {
        dispatch({ type: 'ADD_TASK_REQUEST' }); // Optional: Dispatch request action
        const response = await axios.post(`http://localhost:5000/tasks/${localStorage.getItem('userId')}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        dispatch({ type: 'ADD_TASK_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'ADD_TASK_FAILURE', payload: error.message });
    }
};

export const updateTask = (userId, taskId, formData) => async (dispatch) => {
    console.log(userId, taskId,formData);
    try {
        dispatch({ type: 'UPDATE_TASK_REQUEST' }); // Optional: Dispatch request action
        const response = await axios.put(`http://localhost:5000/tasks/${userId}/${taskId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_TASK_FAILURE', payload: error.message });
    }
};


export const deleteTask = (userId, taskId) => async (dispatch) => {
    console.log(taskId);
    try {
        dispatch({ type: 'DELETE_TASK_REQUEST' }); 
        await axios.delete(`http://localhost:5000/tasks/${userId}`, {
            data: { taskId }, 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        dispatch({ type: 'DELETE_TASK_SUCCESS', payload: { taskId } });
    } catch (error) {
        dispatch({ type: 'DELETE_TASK_FAILURE', payload: error.message });
    }
};

