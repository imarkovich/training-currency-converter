import { useEffect } from 'react';

export type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

export interface NotificationData {
  id: number;
  type: NotificationVariant;
  message: string;
}

interface NotificationProps {
  notification: NotificationData | null;
  onClose: () => void;
  autoDismissMs?: number;
}

const variantStyles: Record<NotificationVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

export default function Notification({
  notification,
  onClose,
  autoDismissMs = 3000,
}: NotificationProps) {
  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, autoDismissMs);

    return () => {
      clearTimeout(timer);
    };
  }, [notification, onClose, autoDismissMs]);

  if (!notification) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
      <div
        role="alert"
        className={`border rounded-lg px-4 py-3 shadow-lg ${variantStyles[notification.type]}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{notification.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold opacity-80 hover:opacity-100"
            aria-label="Close notification"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}