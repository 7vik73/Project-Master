import { Request, Response } from "express";
import NotificationModel from "../models/notification.model";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const getUserNotificationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const notifications = await NotificationModel.find({ recipient: userId })
        .populate({ path: "message", populate: { path: "sender", select: "name" } })
        .sort({ createdAt: -1 });
    res.status(200).json({ message: "Notifications fetched", data: notifications });
});

export const markAllNotificationsReadController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    await NotificationModel.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
    res.status(200).json({ message: "All notifications marked as read" });
}); 