import React, { useEffect, useRef } from 'react';
import { myp5 } from 'src/components/Common/Snow/makeSnow';

export const Snow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    myp5(ref.current);
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', pointerEvents: 'none' }}
    ></div>
  );
};
