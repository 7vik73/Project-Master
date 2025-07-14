import MessageModel from "../models/message.model";
import MemberModel from "../models/member.model";
import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

export const sendMessageService = async (userId: string, workspaceId: string, content: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    // Extract mentions in the form @[Name](userId)
    const mentionRegex = /@\[[^\]]+\]\(([^)]+)\)/g;
    const mentionedUserIds: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
        if (match[1] && !mentionedUserIds.includes(match[1]) && match[1] !== String(userId)) {
            mentionedUserIds.push(match[1]);
        }
    }
    const message = await MessageModel.create({ sender: userId, workspace: workspaceId, content, mentions: mentionedUserIds });

    // --- Notification Logic ---
    if (mentionedUserIds.length > 0) {
        for (const mentionedId of mentionedUserIds) {
            await NotificationModel.create({
                recipient: mentionedId,
                workspace: workspaceId,
                message: message._id,
                type: "mention",
                read: false,
            });
        }
    } else {
        // No mentions, notify all workspace members except sender
        const members = await MemberModel.find({ workspaceId });
        for (const m of members) {
            if (String(m.userId) !== String(userId)) {
                await NotificationModel.create({
                    recipient: m.userId,
                    workspace: workspaceId,
                    message: message._id,
                    type: "general",
                    read: false,
                });
            }
        }
    }
    // --- End Notification Logic ---

    return { message };
};

export const getWorkspaceMessagesService = async (userId: string, workspaceId: string) => {
    // Check if user is a member of the workspace
    const member = await MemberModel.findOne({ userId, workspaceId });
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace");
    }
    const allMessages = await MessageModel.find({ workspace: workspaceId })
        .populate("sender", "name email avatar")
        .sort({ createdAt: 1 });
    // Filter messages: if a message has mentions, only show to sender or mentioned user
    const filteredMessages = allMessages.filter((msg: any) => {
        if (!msg.mentions || msg.mentions.length === 0) return true; // No mentions, show to all
        if (String(msg.sender._id) === String(userId)) return true; // Sender always sees
        // Check if user is mentioned by userId
        return msg.mentions.map((id: any) => String(id)).includes(String(userId));
    });
    return { messages: filteredMessages };
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