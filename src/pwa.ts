export interface PwaState {
  updateAvailable: boolean;
  offlineReady: boolean;
  installPromptReady: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Listener = (state: PwaState) => void;

const listeners = new Set<Listener>();
const state: PwaState = {
  updateAvailable: false,
  offlineReady: false,
  installPromptReady: false,
};

const INSTALL_DISMISSED_KEY = "pwa_install_dismissed_until";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

const isInstallDismissed = () => {
  try {
    const until = localStorage.getItem(INSTALL_DISMISSED_KEY);
    return until !== null && Date.now() < parseInt(until, 10);
  } catch {
    return false;
  }
};

let waitingWorker: ServiceWorker | null = null;
let registered = false;

const emit = () => {
  const snapshot = { ...state };
  listeners.forEach((listener) => listener(snapshot));
};

const setWaitingWorker = (worker: ServiceWorker | null) => {
  waitingWorker = worker;
  state.updateAvailable = worker !== null;
  emit();
};

export const subscribeToPwaState = (listener: Listener) => {
  listeners.add(listener);
  listener({ ...state });

  return () => {
    listeners.delete(listener);
  };
};

export const dismissOfflineReady = () => {
  if (!state.offlineReady) {
    return;
  }

  state.offlineReady = false;
  emit();
};

export const applyServiceWorkerUpdate = () => {
  if (!waitingWorker) {
    return;
  }

  const worker = waitingWorker;
  setWaitingWorker(null);
  worker.postMessage({ type: "SKIP_WAITING" });
};

export const listenForInstallPrompt = () => {
  if (isInstallDismissed()) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e as BeforeInstallPromptEvent;
    state.installPromptReady = true;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    state.installPromptReady = false;
    emit();
  });
};

export const installApp = async () => {
  if (!deferredInstallPrompt) return;
  await deferredInstallPrompt.prompt();
  deferredInstallPrompt = null;
  state.installPromptReady = false;
  emit();
};

export const dismissInstallPrompt = () => {
  deferredInstallPrompt = null;
  state.installPromptReady = false;
  try {
    localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now() + DISMISS_DURATION_MS));
  } catch {
    // ignore
  }
  emit();
};

export const registerServiceWorker = () => {
  if (registered || !import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  registered = true;

  const scope = import.meta.env.BASE_URL;
  const serviceWorkerUrl = `${scope}sw.js`;
  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) {
      return;
    }

    refreshing = true;
    window.location.reload();
  });

  void navigator.serviceWorker
    .register(serviceWorkerUrl, { scope })
    .then((registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state !== "installed") {
            return;
          }

          if (navigator.serviceWorker.controller) {
            setWaitingWorker(installingWorker);
            return;
          }

          state.offlineReady = true;
          emit();
        });
      });

      window.setInterval(() => {
        void registration.update();
      }, 60 * 60 * 1000);
    })
    .catch(() => undefined);
};
