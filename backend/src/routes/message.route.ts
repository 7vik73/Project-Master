import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import { sendMessageController, getWorkspaceMessagesController, editMessageController, deleteMessageController } from "../controllers/message.controller";

const router = Router();

// Get all messages for a workspace
router.get("/workspaces/:workspaceId/messages", isAuthenticated, getWorkspaceMessagesController);
// Send a message in a workspace
router.post("/workspaces/:workspaceId/messages", isAuthenticated, sendMessageController);
// Edit a message in a workspace
router.patch("/workspaces/:workspaceId/messages/:messageId", isAuthenticated, editMessageController);
// Delete a message in a workspace
router.delete("/workspaces/:workspaceId/messages/:messageId", isAuthenticated, deleteMessageController);

export default router; 