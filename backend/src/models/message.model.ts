import mongoose, { Document, Schema } from "mongoose";

export interface MessageDocument extends Document {
    sender: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    edited?: boolean;
    deleted?: boolean;
    deletedAt?: Date;
}

const messageSchema = new Schema<MessageDocument>(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
        content: {
            type: String,
            required: function (this: any) {
                return !this.deleted;
            }
        },
        edited: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);

export default MessageModel; 