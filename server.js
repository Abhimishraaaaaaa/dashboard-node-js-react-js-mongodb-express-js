// API DOcumenATion
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import "express-async-errors";
//security
import helmet from "helmet";
import xss from "xss-clean";
import expresssanitize from "express-mongo-sanitize";
// file
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/Db.js";
//routes
import testRoutes from "./routes/testRouters.js";
import authRouters from "./routes/authRouters.js";
import userRouters from "./routes/userRouters.js";
import jobsRouters from "./routes/jobsRouters.js";
import errorMiddleware from "./middlewares/errroMiddleware.js";

dotenv.config();

// Initialize app
const app = express();
app.set('trust proxy', true)

//mongo connection
connectDB(); // This should be invoked

// Swagger api config
// swagger api options
// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Job Portal Application",
//             description: "Node Expressjs Job Portal Application",
//         },
//         servers: [{
//             //         url: "http://localhost:8080",
//             url: "https://nodejs-job-portal-app.onrender.com",
//         }, ],
//     },
//     apis: ["./routes/*.js"],
// };

// const spec = swaggerDoc(options);

//middleware
app.use(
    helmet({
        contentSecurityPolicy: false, // Example: turn off specific features if needed
        hsts: true, // Ensure hsts is properly set
    })
);
app.use(xss());
app.use(expresssanitize());

app.use(express.json()); // Now it's correctly placed

//files
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRouters);
app.use("/api/v1/user", userRouters);
app.use("/api/v1/job", jobsRouters);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//middleware

app.use(errorMiddleware);

// Port setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is ready on port ${PORT}`.bgCyan.white); // Use backticks for string interpolation
});