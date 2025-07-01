import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
    recipient: mongoose.Types.ObjectId; // User who receives the notification
    workspace: mongoose.Types.ObjectId;
    message: mongoose.Types.ObjectId; // The message that triggered the notification
    type: "mention" | "general";
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
    {
        recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
        workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        message: { type: Schema.Types.ObjectId, ref: "Message", required: true },
        type: { type: String, enum: ["mention", "general"], required: true },
        read: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// TTL index: auto-delete notifications after 30 days (2592000 seconds)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

// For further cleanup (e.g., per-user limit), consider a scheduled job (node-cron) to remove oldest notifications.

const NotificationModel = mongoose.model<NotificationDocument>("Notification", notificationSchema);
export default NotificationModel; 