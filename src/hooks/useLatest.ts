import { useRef, useEffect } from 'react';

function useLatest<T>(value: T) {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default useLatest;