import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useEffect, useState } from "react";
import axios from "@/lib/axios-client";
import { formatDistanceToNow } from "date-fns";

const Header = () => {
  const location = useLocation();
  const workspaceId = useWorkspaceId();

  const pathname = location.pathname;

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications");
        const notifications = res.data.data || [];
        setNotifications(notifications);
        setUnreadCount(notifications.filter((n: any) => !n.read).length);
      } catch (err) {
        setNotifications([]);
        setUnreadCount(0);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  // Mark all as read when dropdown opens
  useEffect(() => {
    if (dropdownOpen && notifications.some((n) => !n.read)) {
      axios.patch("/api/notifications/read-all").then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      });
    }
  }, [dropdownOpen]);

  const getPageLabel = (pathname: string) => {
    if (pathname.includes("/project/")) return "Project";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/tasks")) return "Tasks";
    if (pathname.includes("/members")) return "Members";
    return null; // Default label
  };

  const pageHeading = getPageLabel(pathname);
  return (
    <header className="flex sticky top-0 z-50 bg-white h-12 shrink-0 items-center border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block text-[15px]">
              {pageHeading ? (
                <BreadcrumbLink asChild>
                  <Link to={`/workspace/${workspaceId}`}>Dashboard</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1 ">
                  Dashboard
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {pageHeading && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="text-[15px]">
                  <BreadcrumbPage className="line-clamp-1">
                    {pageHeading}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Notification Bell with Dropdown */}
      <div className="relative mr-4">
        <span
          className="inline-block text-2xl cursor-pointer"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[18px] text-center">
            {unreadCount}
          </span>
        )}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2 font-semibold border-b">Notifications</div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-2 border-b last:border-b-0 text-sm ${n.read ? "bg-white" : "bg-blue-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">
                      {n.message && n.message.sender && n.message.sender.name
                        ? n.message.sender.name
                        : "Message"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="truncate">
                    {n.message && n.message.content
                      ? n.message.content.length > 60
                        ? n.message.content.slice(0, 60) + "..."
                        : n.message.content
                      : "(No message content)"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
