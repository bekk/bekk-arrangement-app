import React, { useState, createContext, useContext, useCallback } from 'react';
import { Notification } from '@bekk/storybook';

type NotificationType = 'INFO' | 'WARNING' | 'ERROR';

interface INotification {
  type: NotificationType;
  title: string;
  message: string;
}

interface IProps {
  children?: JSX.Element;
}

type NotifyUser = (n: INotification) => void;

const NotificationContext = createContext<NotifyUser>(() => undefined);

export const NotificationHandler = ({ children }: IProps) => {
  const [notification, setNotification] = useState<INotification | undefined>();
  const notifyUser = (n: INotification) => setNotification(n);
  return (
    <NotificationContext.Provider value={notifyUser}>
      {notification ? (
        <>
          {children}
          <Notification
            key={notification.message}
            notification={notification}
            onClose={() => setNotification(undefined)}
            visible={true}
          />
        </>
      ) : (
        children
      )}
    </NotificationContext.Provider>
  );
};

/**
 * notify kan kalles manuelt av klientkode med INotification
 *
 * catchAndNotify brukes ved å wrappe ein async funksjon som
 * kan feile. Dvs. `async () => ...` blir `catchAndNotify(() => ...)`
 */
export const useNotification = () => {
  const notify: NotifyUser = useCallback(useContext(NotificationContext), []);
  function _catchAndNotify<T>(f: () => Promise<void>): () => void;
  function _catchAndNotify<T>(f: (x: T) => Promise<void>): (x: T) => void;
  function _catchAndNotify<T>(f: (x?: T) => Promise<void>): any {
    return (x?: T) => {
      f(x).catch(e => {
        if (isNotification(e)) {
          notify(e);
        }
      });
    };
  }
  const catchAndNotify = useCallback(_catchAndNotify, [notify]);
  return { notify, catchAndNotify };
};

const isNotification = (notification: any): notification is INotification =>
  notification &&
  'type' in notification &&
  (notification.type === 'INFO' ||
    notification.type === 'WARNING' ||
    notification.type === 'ERROR') &&
  'title' in notification &&
  typeof notification.title === 'string' &&
  'message' in notification &&
  typeof notification.message === 'string';
