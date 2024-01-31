const twilio = require("twilio");

// Priority Constants
const PRIORITY = {
    "URGENT" : 0,
    "HIGH" : 1,
    "MEDIUM" : 2,
    "LOW" : 3
}

// Task Status Constants
const STATUS = {
    "TODO" : "TODO",
    "IN_PROGRESS" : "IN_PROGRESS",
    "DONE" : "DONE"
}

//Twilio Configuration
const twilioAccountSid = "ACb8eea38e2c1e20468359efbda7f24e24";
const twilioAuthToken = "1ca653082647eca964d0b963e5ac82ea";
const twilioPhoneNumber = "+12707196338";
const twilioVoiceUrl = "https://ginger-lion-1496.twil.io/voice-calling-function";  
const twilioClient = new twilio(twilioAccountSid, twilioAuthToken);


exports.PRIORITY = PRIORITY
exports.STATUS = STATUS
exports.TWILIO_CONFIG = {twilioPhoneNumber, twilioVoiceUrl, twilioClient}