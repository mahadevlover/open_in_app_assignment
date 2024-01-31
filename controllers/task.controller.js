const {tasks, subtasks} = require("../database");
const {calculatePriority} = require("../utils");
const {STATUS} = require("../constants")

function getByQuery(res, query){
    try {
        // Extract query parameters
        const { priority, due_date, page, per_page } = query;
    
        // Convert page and per_page to integers with default values
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(per_page) || 10;
    
        // Filter tasks based on priority and due date
        let filteredTasks = tasks.filter((task) => {
            const isPriorityMatch = !priority || task.priority === parseInt(priority);
            const isDueDateMatch = !due_date || new Date(task.due_date).toISOString().split("T")[0] === due_date;
            return isPriorityMatch && isDueDateMatch;
        });
    
        // Sort tasks based on priority and due date
        filteredTasks = filteredTasks.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.due_date - b.due_date;
        });
    
        // Implement pagination
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    
        res.status(200).json({ tasks: paginatedTasks, totalTasks: filteredTasks.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
      
}

function getAll(res) {
    try {
        return res.status(200).json(tasks)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function create(res, data) {
    try{
        if (!data.title || !data.description || !data.due_date) {
        return res.status(400).json({
            message: "title, description, and due_date are required fields",
        });
        }
        data.due_date = new Date(data.due_date);
    
        const newTask = {
        id: tasks.length + 1,
        title: data.title,
        description: data.description,
        due_date: data.due_date,
        status: STATUS.TODO, // Initial status when no subtask is finished
        priority: calculatePriority(data.due_date),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
        };
    
        tasks.push(newTask);
        return res.status(201).json({ message: "Task Created Successfully", task: newTask });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function updateById(res, data, taskId) {
    try {
        const { due_date, status } = data;
    
        // Find the task by ID
        const taskToUpdate = tasks.find((task) => task.id === taskId);
    
        // Check if the task exists
        if (!taskToUpdate) {
          return res.status(404).json({ message: "Task not found" });
        }
    
        // Update the task
        const taskSubtasks = subtasks.filter((subtask) => subtask.task_id === taskId);
  
        const completedSubtasks = taskSubtasks.filter((subtask) => subtask.status === 1);
    
        if (completedSubtasks.length === taskSubtasks.length) {
            taskToUpdate.status = STATUS.DONE;
        } else if (completedSubtasks.length > 0) {
            taskToUpdate.status = STATUS.IN_PROGRESS;
        } else {
            taskToUpdate.status = STATUS.TODO;
        }
    
        if (status && (status === STATUS.TODO || status === STATUS.DONE)) {
          // Update the task status directly if the status is provided
          taskToUpdate.status = status;
        }
    
        // Update due_date if provided
        if (due_date) {
          taskToUpdate.due_date = new Date(due_date);
        }
    
        taskToUpdate.updated_at = new Date();
    
        res.json({ message: "Task updated successfully", task: taskToUpdate });
      } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

function deleteById(res, taskId){
    try {
        const taskToDelete = tasks.find((item) => item.id === taskId);

        if (taskToDelete) {
            taskToDelete.deleted_at = new Date();    
            subtasks.map((subtask) => {
                if(subtask.task_id === taskId){
                    subtask.deleted_at = new Date();
                }
            })
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.taskController = {
    getByQuery, getAll, create, updateById, deleteById
}