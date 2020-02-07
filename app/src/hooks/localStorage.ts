import { useState, useLayoutEffect, useCallback } from 'react';

type Option<T> = T | undefined;

export const useLocalStorage = ({
  key,
}: {
  key: string;
}): [Option<string>, (str: string) => void] => {
  const [cache, setCache] = useState<Option<string>>(undefined);

  const readLocalStorage = useCallback((): Option<string> => {
    const inStorage = localStorage.getItem(key);
    if (inStorage !== null) {
      return inStorage;
    }
  }, [key]);

  const setLocalStorage = (value: string) => {
    localStorage.setItem(key, value);
    return readLocalStorage();
  };

  useLayoutEffect(() => {
    // Initially read from local storage
    const inStorage = readLocalStorage();
    setCache(inStorage);
  }, [key, readLocalStorage]);

  return [
    cache,
    (valueToStore: string) => {
      const storedValue = setLocalStorage(valueToStore);
      setCache(storedValue);
    },
  ];
};
