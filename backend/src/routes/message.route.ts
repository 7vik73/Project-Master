import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import { sendMessageController, getWorkspaceMessagesController } from "../controllers/message.controller";

const router = Router();

// Get all messages for a workspace
router.get("/workspaces/:workspaceId/messages", isAuthenticated, getWorkspaceMessagesController);
// Send a message in a workspace
router.post("/workspaces/:workspaceId/messages", isAuthenticated, sendMessageController);

export default router; 