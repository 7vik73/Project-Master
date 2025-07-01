import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { sendMessageService, getWorkspaceMessagesService, editMessageService, deleteMessageService } from "../services/message.service";

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

export const editMessageController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = req.params.workspaceId;
    const messageId = req.params.messageId;
    const { content } = req.body;
    if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Message content is required" });
    }
    const { message } = await editMessageService(userId, workspaceId, messageId, content);
    return res.status(200).json({ message: "Message edited", data: message });
});

export const deleteMessageController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = req.params.workspaceId;
    const messageId = req.params.messageId;
    const { message } = await deleteMessageService(userId, workspaceId, messageId);
    return res.status(200).json({ message: "Message deleted", data: message });
}); 