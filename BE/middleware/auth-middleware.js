const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const EFFECTIVE_SECRET = JWT_SECRET || "secret"; 

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send({
            error: "Access denied (Authorization header missing)"
        });
    }

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
         console.error('Malformed Authorization header:', authHeader);
        return res.status(401).send({
            error: "Access denied (Malformed Authorization header - Expected 'Bearer token')"
        });
    }

    const token = authHeader.substring(7); 

    if (!token) {
        console.error('Token missing after Bearer prefix:', authHeader);
        return res.status(401).send({ error: "Access denied (Token missing in header)" });
    }

    try {
        const decoded = jwt.verify(token, EFFECTIVE_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.error("Token Verification Error:", err.name, err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ error: "Token expired" });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: "Invalid token signature or format" });
        }
        return res.status(401).send({
            error: "Invalid token (Verification failed)"
        });
    }
}
function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin === true) {
        next(); 
    } else if (req.user) {
        return res.status(403).send({
            error: "Forbidden: Administrator privileges required"
        });
    } else {
        console.error("isAdmin middleware executed but req.user is not set. Check middleware order.");
        return res.status(401).send({
            error: "Unauthorized: Authentication required"
        });
    }
}

module.exports = { verifyToken, isAdmin };