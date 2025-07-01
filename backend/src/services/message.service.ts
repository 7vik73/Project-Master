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