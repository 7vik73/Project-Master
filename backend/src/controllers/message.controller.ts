import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { sendMessageService, getWorkspaceMessagesService } from "../services/message.service";

export const sendMessageController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = req.params.workspaceId;
    const { content } = req.body;
    if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Message content is required" });
    }
    const { message } = await sendMessageService(userId, workspaceId, content);
    return res.status(201).json({ message: "Message sent", data: message });
});

export const getWorkspaceMessagesController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = req.params.workspaceId;
    const { messages } = await getWorkspaceMessagesService(userId, workspaceId);
    return res.status(200).json({ message: "Messages fetched", data: messages });
}); 