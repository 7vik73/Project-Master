import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import { getUserNotificationsController, markAllNotificationsReadController } from "../controllers/notification.controller";

const router = Router();

// Get notifications for the logged-in user
router.get("/", isAuthenticated, getUserNotificationsController);

// Mark all notifications as read
router.patch("/read-all", isAuthenticated, markAllNotificationsReadController);

export default router; 