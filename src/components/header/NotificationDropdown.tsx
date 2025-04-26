import { useState, useCallback, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link } from "react-router-dom";
import { notificationService, Notification } from "../../services/notificationService";
import { useAuth0 } from "@auth0/auth0-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useGlobalStorage } from "../../hooks/useGlobalStorage";
import UserMetadata from "../../types/user";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { user } = useAuth0();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProfilePicture = (notification: Notification) => {
    // First try to get the sender's profile picture directly from the notification
    if ('senderProfilePic' in notification && notification.senderProfilePic) {
      return notification.senderProfilePic;
    }
    
    // Fallback to creator's profile picture if available
    // if (notification.creator?.profile?.profilePictureUrl) {
    //   return notification.creator.profile.profilePictureUrl;
    // }

    // If the notification is from the current user, use their stored profile picture
    if (notification.createdBy === user?.sub && userMetadata?.profile?.profilePictureUrl) {
      return userMetadata.profile.profilePictureUrl;
    }

    return null;
  };

  const fetchNotifications = useCallback(async (fetchAll = false) => {
    if (!user?.sub) return;
    
    try {
      const userNotifications = fetchAll 
        ? await notificationService.getAllUserNotifications(user.sub)
        : await notificationService.getUnreadNotifications(user.sub);
      
      if (!Array.isArray(userNotifications)) {
        console.error('Expected array of notifications but got:', userNotifications);
        return;
      }
      
      const sortedNotifications = [...userNotifications].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setNotifications(sortedNotifications);
      
      // Only update notifying state when showing unread notifications
      if (!fetchAll) {
        setNotifying(sortedNotifications.length > 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setNotifying(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    // Initial fetch
    fetchNotifications(showAllNotifications);

    // Set up polling every 30 seconds
    const pollInterval = setInterval(() => {
      fetchNotifications(showAllNotifications);
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, [fetchNotifications, showAllNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.sub) return;
    
    try {
      await notificationService.markAsRead(notificationId, user.sub);
      
      if (!showAllNotifications) {
        // If showing only unread, remove the notification from the list
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
      } else {
        // If showing all, update the read status
        setNotifications(prev => prev.map(n => 
          n._id === notificationId 
            ? { ...n, read: [...n.read, { userId: user.sub!, readAt: new Date() }] }
            : n
        ));
      }

      // Fetch unread count to update notifying state
      const unreadNotifications = await notificationService.getUnreadNotifications(user.sub);
      setNotifying(unreadNotifications.length > 0);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleNotificationView = () => {
    setShowAllNotifications(!showAllNotifications);
    fetchNotifications(!showAllNotifications);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-850 dark:text-gray-200 sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {showAllNotifications ? 'All Notifications' : 'Unread Notifications'}
          </h5>
          <button
            onClick={toggleNotificationView}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showAllNotifications ? 'Show Unread' : 'Show All'}
          </button>
        </div>

        <div className="overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownItem
                key={notification._id}
                as="div"
                className={`mb-2 p-3 ${
                  !notification.read.some(r => r.userId === user?.sub)
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {notification.senderProfilePic && (
                    <div className="flex-shrink-0">
                      <img
                        src={notification.senderProfilePic}
                        alt="Sender"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read.some(r => r.userId === user?.sub) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownItem>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          )}
        </div>
      </Dropdown>
    </div>
  );
}
