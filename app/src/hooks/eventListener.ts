import { useEffect } from 'react';

export function useEventListener(
  eventType: string,
  onEventTrigger: React.EventHandler<any>,
  dependents: any[]
) {
  useEffect(() => {
    document.addEventListener(eventType, onEventTrigger, false);
    return () => document.removeEventListener(eventType, onEventTrigger, false);
  }, dependents);
}

export function useKeyDownWithModifier(
  key: string,
  modifier: string,
  onKeyDown: () => void
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === key && e.getModifierState(modifier)) {
      e.preventDefault();
      onKeyDown();
    }
  };
  useEventListener('keydown', handleKeyDown, [key, modifier, onKeyDown]);
}

export function useKeyDown(key: string, onKeyDown: () => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === key && !isStandardModifierPressed(e)) {
      onKeyDown();
    }
  };
  useEventListener('keydown', handleKeyDown, [key, onKeyDown]);
}

const isStandardModifierPressed = (e: KeyboardEvent) =>
  e.getModifierState('Shift') ||
  e.getModifierState('Control') ||
  e.getModifierState('Meta') ||
  e.getModifierState('Alt');
