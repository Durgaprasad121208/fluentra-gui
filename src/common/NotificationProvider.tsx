import React, { createContext, useContext } from 'react';
import { App as AntApp, notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextType {
  openNotification: (
    type: NotificationType,
    title: string,
    description?: string,
    duration?: number
  ) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useAppNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useAppNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationInner: React.FC<NotificationProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    title: string,
    description?: string,
    duration: number = 4.5
  ) => {
    const config: NotificationArgsProps = {
      message: title,
      description,
      duration,
      placement: 'topRight',
    };

    api[type](config);
  };

  const notifyHelpers: NotificationContextType = {
    openNotification,
    success: (title, description) => openNotification('success', title, description),
    error: (title, description) => openNotification('error', title, description),
    info: (title, description) => openNotification('info', title, description),
    warning: (title, description) => openNotification('warning', title, description),
  };

  return (
    <NotificationContext.Provider value={notifyHelpers}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  return (
    <AntApp>
      <NotificationInner>{children}</NotificationInner>
    </AntApp>
  );
};

export default NotificationProvider;
