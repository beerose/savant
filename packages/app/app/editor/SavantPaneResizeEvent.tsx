const type = "SavantPaneResizeEvent";

interface SavantPaneResizeEvent extends Event {
  type: typeof type;
}

export const SavantPaneResizeEvent = {
  addEventListener(listener: (event: SavantPaneResizeEvent) => void) {
    window.addEventListener(type, listener as EventListener);

    return () => window.removeEventListener(type, listener as EventListener);
  },

  dispatch() {
    window.dispatchEvent(new Event(type));
  },
};
