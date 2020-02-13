import { useState, useEffect, useCallback } from 'react';
import { isError } from 'util';

export type Ok<T> = {
  status: 'OK';
  data: T;
};

export type Loading = {
  status: 'LOADING';
};

export type Pending<T> = {
  status: 'PENDING';
  staleData: T;
};

export type NotRequested = {
  status: 'NOT_REQUESTED';
};

export type Bad = {
  status: 'ERROR';
  userMessage: string;
};

export type RemoteData<T> = Ok<T> | Loading | Pending<T> | Bad | NotRequested;

export function isLoading<T>(data: RemoteData<T>): data is Loading {
  return data.status === 'LOADING';
}

export function isPending<T>(data: RemoteData<T>): data is Pending<T> {
  return data.status === 'PENDING';
}

export function hasLoaded<T>(data: RemoteData<T>): data is Ok<T> {
  return data.status === 'OK';
}

export function isNotRequested<T>(data: RemoteData<T>): data is NotRequested {
  return data.status === 'NOT_REQUESTED';
}

export function isBad<T>(data: RemoteData<T>): data is Bad {
  return data.status === 'ERROR';
}

export const cachedRemoteData = <Key extends string, T>() => {
  let cache: Record<string, RemoteData<T>> = {};
  return ({ key, fetcher }: { key: Key; fetcher: () => Promise<T> }) => {
    const value = useRemoteData(fetcher);

    const cachedValue = cache[key];
    if (cachedValue) {
      if (
        (isNotRequested(value) || isLoading(value)) &&
        hasLoaded(cachedValue)
      ) {
        return cachedValue;
      }
    }

    cache[key] = value;

    return value;
  };
};

export const useRemoteData = <T>(fetcher: () => Promise<T>): RemoteData<T> => {
  const [remoteData, updateRemoteData] = useUpdateRemoteData(fetcher);
  useEffect(() => {
    updateRemoteData(undefined);
  }, [updateRemoteData]);
  return remoteData;
};

export const useUpdateRemoteData = <T, P>(
  fetcher: (param: P) => Promise<T>
): [RemoteData<T>, (param: P) => void] => {
  const [remoteData, setRemoteData] = useState<RemoteData<T>>({
    status: 'NOT_REQUESTED',
  });

  const updateRemoteData = useCallback(
    (param: P) => {
      setRemoteData(remoteData => {
        if (hasLoaded(remoteData)) {
          return {
            status: 'PENDING',
            staleData: remoteData.data,
          };
        }
        if (isError(remoteData) || isNotRequested(remoteData)) {
          return { status: 'LOADING' };
        }
        return remoteData;
      });
      fetcher(param)
        .then(data => setRemoteData({ status: 'OK', data }))
        .catch(({ userMessage }) => {
          return setRemoteData({
            status: 'ERROR',
            userMessage,
          });
        });
    },
    [fetcher]
  );

  return [remoteData, updateRemoteData];
};
