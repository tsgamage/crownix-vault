type ShortcutHandler = () => void;

class ShortcutService {
  private handlers = new Map<string, ShortcutHandler>();

  constructor() {
    window.addEventListener("keydown", this.onKeyDown, true);

    // Prevent Developer Tools
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    // Prevent Right Click
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Prevent Zoom
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && ["r", "+", "-", "0"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && ["j", "g"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;

    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }

    const key = e.key.toLowerCase();
    const handler = this.handlers.get(key);
    if (!handler) return;

    e.preventDefault();
    handler();
  };

  register(key: string, handler: ShortcutHandler) {
    this.handlers.set(key.toLowerCase(), handler);
  }

  unregister(key: string) {
    this.handlers.delete(key.toLowerCase());
  }

  clear() {
    this.handlers.clear();
  }
}

export const shortcutService = new ShortcutService();
