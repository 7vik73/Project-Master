import MessageModel from "../models/message.model";
import MemberModel from "../models/member.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

export const sendMessageService = async (userId: string, workspaceId: string, content: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    const message = await MessageModel.create({ sender: userId, workspace: workspaceId, content });
    return { message };
};

export const getWorkspaceMessagesService = async (userId: string, workspaceId: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    const messages = await MessageModel.find({ workspace: workspaceId })
        .populate("sender", "name email avatar")
        .sort({ createdAt: 1 });
    return { messages };
};

export const editMessageService = async (userId: string, workspaceId: string, messageId: string, newContent: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    const message = await MessageModel.findOne({ _id: messageId, workspace: workspaceId });
    if (!message) {
        throw new NotFoundException("Message not found");
    }
    if (String(message.sender) !== String(userId)) {
        throw new UnauthorizedException("You can only edit your own messages");
    }
    message.content = newContent;
    message.edited = true;
    await message.save();
    return { message };
};

export const deleteMessageService = async (userId: string, workspaceId: string, messageId: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    const message = await MessageModel.findOne({ _id: messageId, workspace: workspaceId });
    if (!message) {
        throw new NotFoundException("Message not found");
    }
    if (String(message.sender) !== String(userId)) {
        throw new UnauthorizedException("You can only delete your own messages");
    }
    message.deleted = true;
    message.deletedAt = new Date();
    message.content = "";
    await message.save();
    return { message };
}; 