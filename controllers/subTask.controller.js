const { tasks, subtasks } = require("../database");
const { STATUS } = require("../constants")

function getByTaskId(res, taskId) {
    try {
        // Filter subtasks based on task_id if provided
        let filteredSubtasks = subtasks;
        if (!taskId) {
            return res.status(404).json({ message: "Task not found" });
        }

        filteredSubtasks = subtasks.filter((subtask) => subtask.task_id === taskId);

        return res.json({ subtasks: filteredSubtasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function create(res, taskId, data) {
    try {
        const { description } = data;

        // Validate if description is provided
        if (!description) {
            return res.status(400).json({ message: 'Description is a required field' });
        }

        // Find the task by ID
        const task = tasks.find((task) => task.id == taskId);
        tasks.forEach((task) => console.log(task))
        // Check if the task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Create the subtask
        const subtask = {
            id: subtasks.length + 1, // Generate a new subtask ID
            task_id: taskId,
            description: description,
            status: STATUS.TODO, // Initial status is Todo
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        // Add the subtask to the subtasks array
        subtasks.push(subtask);

        return res.status(201).json({ message: "Subtask created successfully", subTask: subtask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function update(res, subTaskId, data) {
    try {
        const { status } = data;
    
        // Find the subtask by ID
        const subtaskToUpdate = subtasks.find((subtask) => subtask.id === subTaskId);
    
        // Check if the subtask exists
        if (!subtaskToUpdate) {
          return res.status(404).json({ message: "Subtask not found" });
        }
    
        // Validate the status value (0 or 1)
        if (status !== 0 && status !== 1) {
          return res.status(400).json({ message: "Invalid status value. It should be 0 or 1." });
        }
    
        // Update the status of the subtask
        subtaskToUpdate.status = status;
        subtaskToUpdate.updated_at = new Date();
    
        // Update the status of the task based on subtasks
        const task = tasks.find((task) => task.id === subtaskToUpdate.task_id);
        if (task) {
            const taskSubtasks = subtasks.filter((subtask) => subtask.task_id === taskId);
  
            const completedSubtasks = taskSubtasks.filter((subtask) => subtask.status === 1);
        
            if (completedSubtasks.length === taskSubtasks.length) {
                taskToUpdate.status = STATUS.DONE;
            } else if (completedSubtasks.length > 0) {
                taskToUpdate.status = STATUS.IN_PROGRESS;
            } else {
                taskToUpdate.status = STATUS.TODO;
            }
        }
    
        res.json({ message: "Subtask status updated successfully", subtask: subtaskToUpdate });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

function deleteById(res, subTaskId){
    try {
        const itemToDelete = subtasks.find((item) => item.id === subTaskId);

        if (itemToDelete) {
            itemToDelete.deleted_at = new Date();
        }

        return res.status(200).json({ message: "Sub Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.taskController = {
    getByTaskId, update, create, deleteById
}