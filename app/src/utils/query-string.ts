import queryString from 'query-string';
import { useHistory } from 'react-router';

export const queryStringStringify = (queries: any): string => {
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
