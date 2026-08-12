const TOAST_EVENT = "app:toast";

export const showToast = (message, type = "success", duration = 3500) => {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: Date.now() + Math.random(), message, type, duration },
    }),
  );
};

export { TOAST_EVENT };
