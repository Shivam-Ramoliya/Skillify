const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret_key",
        );
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is not valid",
        });
    }
};

module.exports = protect;
