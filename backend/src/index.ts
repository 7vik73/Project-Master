import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session = require("express-session");
import MongoStore from "connect-mongo";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { SessionManager } from "./utils/session-manager";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import messageRoutes from "./routes/message.route";
import notificationRoutes from "./routes/notification.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create MongoDB session store with robust configuration
const mongoStore = MongoStore.create({
  mongoUrl: config.MONGO_URI,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60 * 365 * 3, // 3 years in seconds
  autoRemove: 'interval',
  autoRemoveInterval: 60, // Check for expired sessions every 60 minutes (1 hour)
  touchAfter: 24 * 3600, // Only update session once per day
  crypto: {
    secret: config.SESSION_SECRET
  }
});

// Enhanced session configuration
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 * 365 * 3, // 3 years in milliseconds
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: '/',
    },
    name: 'sessionId',
    rolling: true, // Extend session on activity
    unset: 'destroy', // Remove session when unset
  }) as any
);

// Session error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any): Response {
    if (req.session && typeof req.session.destroy === 'function') {
      // Ensure session is saved before response ends
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        originalEnd.call(this, chunk, encoding);
      });
      return this;
    } else {
      return originalEnd.call(this, chunk, encoding);
    }
  };
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/message`, isAuthenticated, messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoStore.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await mongoStore.close();
  process.exit(0);
});

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  console.log(`Session store: MongoDB (${config.MONGO_URI})`);
  console.log(`Session TTL: 3 years`);
  console.log(`Session cleanup: Every 60 minutes`);
  await connectDatabase();
});
