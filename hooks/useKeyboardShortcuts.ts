import { useEffect, useCallback } from "react";

type KeyCombination = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type KeyboardShortcutHandler = (event: KeyboardEvent) => void;

function matchesShortcut(event: KeyboardEvent, shortcut: KeyCombination): boolean {
  const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
  
  if (ctrlOrMeta && !event.ctrlKey && !event.metaKey) return false;
  if (shortcut.shift && !event.shiftKey) return false;
  if (shortcut.alt && !event.altKey) return false;
  
  const key = event.key.toLowerCase();
  const shortcutKey = shortcut.key.toLowerCase();
  
  return key === shortcutKey;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: Record<string, KeyCombination | KeyCombination[]>,
  handlers: Record<string, KeyboardShortcutHandler>,
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        const isModifierPressed = event.ctrlKey || event.metaKey || event.altKey;
        if (!isModifierPressed) return;
      }

      for (const [action, shortcutOrShortcuts] of Object.entries(shortcuts)) {
        const shortcuts = Array.isArray(shortcutOrShortcuts) ? shortcutOrShortcuts : [shortcutOrShortcuts];
        
        for (const shortcut of shortcuts) {
          if (matchesShortcut(event, shortcut)) {
            const handler = handlers[action];
            if (handler) {
              if (preventDefault) {
                event.preventDefault();
              }
              handler(event);
              return;
            }
          }
        }
      }
    },
    [enabled, preventDefault, shortcuts, handlers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useCmdK(onOpen: () => void, enabled = true) {
  useKeyboardShortcuts(
    {
      openChat: { key: "k", meta: true },
      openChatAlt: { key: "k", ctrl: true },
    },
    {
      openChat: () => onOpen(),
    },
    { enabled }
  );
}

export function useEscape(onEscape: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
}

export function useGlobalShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = [];
      if (event.ctrlKey) key.push("ctrl");
      if (event.metaKey) key.push("meta");
      if (event.shiftKey) key.push("shift");
      if (event.altKey) key.push("alt");
      key.push(event.key.toLowerCase());
      
      const combo = key.join("+");
      const action = shortcuts[combo];
      
      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
