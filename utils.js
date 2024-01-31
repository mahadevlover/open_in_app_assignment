const { PRIORITY, twilioPhoneNumber, twilioVoiceUrl, twilioClient } = require("./constants")
const { tasks, users } = require("./database")


// Helper function to calculate priority based on due_date
function calculatePriority(due_date) {
    const date1 = new Date();
    const date2 = due_date;
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return PRIORITY.URGENT;
    else if (diffDays === 1 || diffDays === 2) return PRIORITY.HIGH;
    else if (diffDays === 3 || diffDays === 4) return PRIORITY.MEDIUM;
    else return PRIORITY.LOW;
}

function updateTaskPriority() {
    const currentDate = new Date();

    tasks.forEach((task) => {
        if (!task.deleted_at && task.due_date < currentDate) {
            task.priority = calculatePriority(task.due_date);
        }
    });
}

function voiceCalling() {
    const priorityUsers = users.sort((a, b) => a.priority - b.priority);

    for (const user of priorityUsers) {
        const userTasks = tasks.filter(task => task.priority === user.priority && task.status !== "DONE");

        if (userTasks.length > 0) {
            const taskToCall = userTasks[0];
            twilioClient.calls
                .create({
                    to: user.phone_number,
                    from: twilioPhoneNumber,
                    url: `${twilioVoiceUrl}?taskId=${taskToCall.id}`,
                })
                .then((call) => console.log(`Call SID: ${call.sid}`))
                .catch((err) => console.error(err));
        }
    }
}


exports.calculatePriority = calculatePriority
exports.updateTaskPriority = updateTaskPriority
exports.voiceCalling = voiceCalling