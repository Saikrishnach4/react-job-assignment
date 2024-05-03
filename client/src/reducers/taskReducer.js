
const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TASKS_REQUEST':
        case 'ADD_TASK_REQUEST':
        case 'UPDATE_TASK_REQUEST':
        case 'DELETE_TASK_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_TASKS_SUCCESS':
            return { ...state, tasks: action.payload, loading: false, error: null };
        case 'ADD_TASK_SUCCESS':
            return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null };
        case 'UPDATE_TASK_SUCCESS':
            const updatedTasks = state.tasks.map(task => task._id === action.payload._id ? action.payload : task);
            return { ...state, tasks: updatedTasks, loading: false, error: null };
        case 'DELETE_TASK_SUCCESS':
            const filteredTasks = state.tasks.filter(task => task._id !== action.payload.taskId);
            return { ...state, tasks: filteredTasks, loading: false, error: null };
        case 'FETCH_TASKS_FAILURE':
        case 'ADD_TASK_FAILURE':
        case 'UPDATE_TASK_FAILURE':
        case 'DELETE_TASK_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default taskReducer;
