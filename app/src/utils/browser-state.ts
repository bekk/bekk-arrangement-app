import queryString from 'query-string';
import { useHistory, useParams } from 'react-router';
import { Optional } from 'src/types';
import { useState } from 'react';

export const queryStringStringify = (
  queries: Record<string, string | number | undefined>
): string => {
  const query = queryString.stringify(queries);
  if (query) {
    return `?${query}`;
  }
  return '';
};

export const useQuery = (key: string) => {
  const {
    location: { search },
  } = useHistory();
  const params = queryString.parse(search);
  if (key in params) {
    const value = params[key];
    if (typeof value === 'string') {
      return value;
    }
  }
};

export const useParam = (parameter: string) => {
  const params: Record<string, Optional<string>> = useParams();
  return params[parameter.substring(1)] || parameter;
};

export function usePersistentHistoryState<T>(
  initalSate: T
): [T, (newState: T) => void];
export function usePersistentHistoryState<T>(
  initalSate?: T
): [Optional<T>, (newState: T) => void];
export function usePersistentHistoryState<T>(initalSate?: T) {
  const history = useHistory();
  const state = history.location.state || initalSate;
  return [
    state,
    (newState: T) => {
      history.replace(history.location.pathname, newState);
    },
  ];
}
