export const compose = <A, B>(f: (x: A) => B) => <C>(g: (y: B) => C) => (
  x: A
) => g(f(x));
