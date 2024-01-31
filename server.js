const express = require("express");
const cron = require("node-cron");
const {updateTaskPriority} = require("./utils")
const {taskRouter} = require("./routes/task.routes")
const {subTaskRouter} = require("./routes/subTask.routes")

const app = express();
app.use(express.json());

// Cron Job for changing priority of tasks based on due_date
cron.schedule("0 0 * * *", () => {
  updateTaskPriority();
});

// Cron Job for voice calling using Twilio
cron.schedule("5 0 * * *", () => {
  voiceCalling();
});

// Helper function to make voice calls using Twilio based on priority

app.use(taskRouter)
app.use(subTaskRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
