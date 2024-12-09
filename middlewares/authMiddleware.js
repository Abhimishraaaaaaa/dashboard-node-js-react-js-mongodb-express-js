import JWT from "jsonwebtoken";

const userAuth = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authentication failed: No token provided" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        // Attach the userId to the request object
        req.body.user = { userId: payload.userId };
        next();
    } catch (error) {
        // Handle invalid token or other errors
        return res
            .status(401)
            .json({ message: "Authentication failed: Invalid token" });
    }
};

export default userAuth;