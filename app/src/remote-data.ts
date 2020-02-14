import { useState, useEffect, useCallback } from 'react';
import { isError } from 'util';

export type Ok<T> = {
  status: 'OK';
  dataIsStale?: false;
  data: T;
};

export type Loading = {
  status: 'LOADING';
};

export type Pending<T> = {
  status: 'PENDING';
  dataIsStale: true;
  data: T;
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

export function isOk<T>(data: RemoteData<T>): data is Ok<T> {
  return data.status === 'OK';
}

export function hasLoaded<T>(data: RemoteData<T>): data is Ok<T> | Pending<T> {
  return isOk(data) || isPending(data);
}

export function isNotRequested<T>(data: RemoteData<T>): data is NotRequested {
  return data.status === 'NOT_REQUESTED';
}

export function isBad<T>(data: RemoteData<T>): data is Bad {
  return data.status === 'ERROR';
}

export function cachedRemoteData<Key extends string, T>() {
  let cache: Map<Key, RemoteData<T>> = new Map();

  return {
    useMany: (
      fetcher: () => Promise<Array<[Key, T]>>
    ): Map<Key, RemoteData<T>> => {
      const values = useRemoteData(fetcher);
      return cache;
    },
    useOne: ({
      key,
      fetcher,
    }: {
      key: Key;
      fetcher: () => Promise<T>;
    }): RemoteData<T> => {
      const value = useRemoteData(fetcher);

      const cachedValue = cache.get(key);
      if (cachedValue) {
        if (
          (isNotRequested(value) || isLoading(value)) &&
          hasLoaded(cachedValue)
        ) {
          return cachedValue;
        }
      }

      if (hasLoaded(value)) {
        cache.set(key, {
          status: 'PENDING',
          dataIsStale: true,
          data: value.data,
        });
      }

      return value;
    },
  };
}

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
            dataIsStale: true,
            data: remoteData.data,
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
