const jwt = require("jsonwebtoken");


// JWT Configuration
const secretKey = "2GHR9nL574keGXHjamofCYr3GUzTMZvqCuJrZMgdwAs="; // Replace with your actual secret key


// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized - Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Token not provided" });
    }

    jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ message: "Forbidden - Token verification failed" });
        }

        console.log("Decoded Token:", user);

        req.user = user;
        next();
    });
}

exports.authenticateToken = authenticateToken