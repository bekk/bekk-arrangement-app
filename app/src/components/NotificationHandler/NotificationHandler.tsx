import React, { useState, createContext, useContext, useCallback } from 'react';
import { Notification } from '@bekk/storybook';

export class UserNotification extends Error {
  public title: string;
  public userMessage: string;
  constructor(userMessage: string, title: string = 'Feil') {
    super();
    this.title = title;
    this.userMessage = userMessage;
  }
}

interface IProps {
  children?: JSX.Element;
}

type NotifyUser = (n: UserNotification) => void;

const NotificationContext = createContext<NotifyUser>(() => undefined);

export const NotificationHandler = ({ children }: IProps) => {
  const [notification, setNotification] = useState<
    UserNotification | undefined
  >();
  const notifyUser = (n: UserNotification) => setNotification(n);
  return (
    <NotificationContext.Provider value={notifyUser}>
      <>
        {children}
        {notification && (
          <Notification
            key={notification.message}
            notification={{
              type: 'ERROR',
              title: notification.title,
              message: notification.userMessage,
            }}
            onClose={() => setNotification(undefined)}
            visible={true}
          />
        )}
      </>
    </NotificationContext.Provider>
  );
};

/**
 * notify kan kalles manuelt av klientkode med UserNotification
 *
 * catchAndNotify brukes ved å wrappe ein async funksjon som
 * kan feile. Dvs. `async () => ...` blir `catchAndNotify(() => ...)`
 */
export const useNotification = () => {
  const notify: NotifyUser = useCallback(useContext(NotificationContext), []);
  function _catchAndNotify<T, R>(f: () => Promise<R>): () => Promise<R>;
  function _catchAndNotify<T, R>(f: (x: T) => Promise<R>): (x: T) => Promise<R>;
  function _catchAndNotify<T, R>(
    f: (x?: T) => Promise<R>
  ): (x?: T) => Promise<R> {
    return (x?: T) =>
      f(x).catch(e => {
        if (e instanceof UserNotification) {
          notify(e);
        }
        return Promise.reject(e);
      });
  }
  const catchAndNotify = useCallback(_catchAndNotify, [notify]);
  return { notify, catchAndNotify };
};
