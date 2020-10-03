const type = "SavantPaneResizeEvent";

export const SavantPaneResizeEvent = {
  addEventListener(listener: (event: Event) => void) {
    window.addEventListener(type, listener);

    return () => window.removeEventListener(type, listener);
  },

  dispatch() {
    window.dispatchEvent(new Event(type));
  },
};
