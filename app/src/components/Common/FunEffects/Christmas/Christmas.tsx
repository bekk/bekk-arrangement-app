import React, { useEffect, useRef } from 'react';
import { myp5 } from 'src/components/Common/FunEffects/Christmas/makeChristmas';

export const Christmas = () => {
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
