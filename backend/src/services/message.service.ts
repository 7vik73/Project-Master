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
    const message = await MessageModel.create({ sender: userId, workspace: workspaceId, content });

    // --- Notification Logic ---
    // Find mentions in the form @name (split by space, punctuation, etc.)
    const mentionRegex = /@([\w\-]+)/g;
    const mentionedNames = Array.from(content.matchAll(mentionRegex)).map(match => match[1]);
    let notifiedUserIds: string[] = [];
    if (mentionedNames.length > 0) {
        // Find users in the workspace with these names
        const mentionedMembers = await MemberModel.find({ workspaceId }).populate("userId", "name");
        for (const name of mentionedNames) {
            const member = mentionedMembers.find(m => m.userId && (m.userId as any).name && (m.userId as any).name.replace(/\s+/g, '').toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
            if (member && String(member.userId._id) !== String(userId)) {
                await NotificationModel.create({
                    recipient: member.userId._id,
                    workspace: workspaceId,
                    message: message._id,
                    type: "mention",
                    read: false,
                });
                notifiedUserIds.push(String(member.userId._id));
            }
        }
    }
    if (notifiedUserIds.length === 0) {
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
    // Filter messages: if a message contains a mention, only show to sender or mentioned user
    const filteredMessages = allMessages.filter((msg: any) => {
        const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
        const mentions = Array.from((msg.content || "").matchAll(mentionRegex)).map(match => (match as string[])[1]);
        if (mentions.length === 0) return true; // No mentions, show to all
        if (String(msg.sender._id) === String(userId)) return true; // Sender always sees
        // Check if user is mentioned by name
        return mentions.some(name => name === ((member.userId as any).name));
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