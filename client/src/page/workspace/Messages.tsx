import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/auth-provider";

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
        profilePicture?: string;
    };
    content: string;
    createdAt: string;
    edited?: boolean;
    deleted?: boolean;
    deletedAt?: string;
}

const Messages = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/api/message/workspaces/${workspaceId}/messages`);
            setMessages(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Optionally, poll for new messages every 5s
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [workspaceId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSending(true);
        try {
            await axios.post(`/api/message/workspaces/${workspaceId}/messages`, { content });
            setContent("");
            fetchMessages();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleEdit = (msg: Message) => {
        setEditingMessageId(msg._id);
        setEditContent(msg.content);
    };

    const handleEditSave = async (msg: Message) => {
        if (!editContent.trim()) return;
        try {
            await axios.patch(`/api/message/workspaces/${workspaceId}/messages/${msg._id}`, { content: editContent });
            setEditingMessageId(null);
            setEditContent("");
            fetchMessages();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to edit message");
        }
    };

    const handleEditCancel = () => {
        setEditingMessageId(null);
        setEditContent("");
    };

    const handleDelete = async (msg: Message) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        setDeletingMessageId(msg._id);
        try {
            await axios.delete(`/api/message/workspaces/${workspaceId}/messages/${msg._id}`);
            fetchMessages();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete message");
        } finally {
            setDeletingMessageId(null);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh] bg-background rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-2">Workspace Chat</h2>
            <div className="flex-1 overflow-y-auto space-y-2 mb-2 bg-muted p-2 rounded">
                {loading ? (
                    <div className="text-center text-muted-foreground">Loading messages...</div>
                ) : error ? (
                    <div className="text-center text-destructive">{error}</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">No messages yet.</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className={`flex gap-2 items-start ${msg.sender._id === user?._id ? "justify-end" : "justify-start"}`}>
                            {msg.sender._id !== user?._id && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.sender.profilePicture || ""} />
                                    <AvatarFallback>{msg.sender.name?.[0]}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-xs rounded-lg px-3 py-2 relative ${msg.sender._id === user?._id ? "bg-primary text-primary-foreground pr-16" : "bg-white dark:bg-gray-800"}`}>
                                <div className="text-xs font-semibold flex items-center gap-2">
                                    {msg.sender._id === user?._id ? "You" : msg.sender.name}
                                    <span className="ml-2 text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                    {msg.edited && !msg.deleted && <span className="text-[10px] text-muted-foreground">(edited)</span>}
                                </div>
                                <div className="break-words whitespace-pre-wrap text-sm">
                                    {msg.deleted ? (
                                        <span className="italic text-muted-foreground">This message was deleted</span>
                                    ) : editingMessageId === msg._id ? (
                                        <form onSubmit={e => { e.preventDefault(); handleEditSave(msg); }} className="flex gap-1 items-center">
                                            <Input
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                className="flex-1 h-7 text-xs"
                                                autoFocus
                                            />
                                            <Button type="submit" size="sm" className="h-7 px-2">Save</Button>
                                            <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={handleEditCancel}>Cancel</Button>
                                        </form>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                                {/* Edit/Delete menu for own messages */}
                                {msg.sender._id === user?._id && !msg.deleted && editingMessageId !== msg._id && (
                                    <div className="absolute top-1 right-1 flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-6 w-6 p-0" title="Edit" onClick={() => handleEdit(msg)}>
                                            ✏️
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6 p-0" title="Delete" onClick={() => handleDelete(msg)} disabled={deletingMessageId === msg._id}>
                                            🗑️
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2 mt-2">
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1"
                />
                <Button type="submit" disabled={sending || !content.trim()}>Send</Button>
            </form>
        </div>
    );
};

export default Messages; 