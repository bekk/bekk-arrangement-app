import { useState, useLayoutEffect } from 'react';

export const useUpdateableInitialValue = <T extends string | number>(
  initialValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState(initialValue);
  useLayoutEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, setValue];
};
