import { useState, useLayoutEffect } from 'react';

export const useUpdateableInitialValue = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  useLayoutEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, setValue];
};
