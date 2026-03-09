import { useEffect, useState } from "react";
import {
  applyServiceWorkerUpdate,
  dismissInstallPrompt,
  dismissOfflineReady,
  installApp,
  subscribeToPwaState,
  type PwaState,
} from "../pwa";

const initialState: PwaState = {
  updateAvailable: false,
  offlineReady: false,
  installPromptReady: false,
};

function PwaBanner() {
  const [pwaState, setPwaState] = useState<PwaState>(initialState);
  const [updateDismissed, setUpdateDismissed] = useState(false);

  useEffect(() => {
    return subscribeToPwaState((nextState) => {
      setPwaState(nextState);
      if (!nextState.updateAvailable) {
        setUpdateDismissed(false);
      }
    });
  }, []);

  const showUpdate = pwaState.updateAvailable && !updateDismissed;
  const showInstall = pwaState.installPromptReady && !showUpdate;
  const showOfflineReady = pwaState.offlineReady && !showUpdate && !showInstall;

  if (!showUpdate && !showInstall && !showOfflineReady) {
    return null;
  }

  return (
    <div className="pwa-banner" role="status" aria-live="polite">
      <div className="pwa-banner__content">
        <strong className="pwa-banner__title">
          {showUpdate ? "Update available" : showInstall ? "Install EV Charging Calculator" : "Ready offline"}
        </strong>
        <span className="pwa-banner__message">
          {showUpdate
            ? "A new version of EV Charging Calculator is ready to install."
            : showInstall
            ? "Add to your home screen for quick access, offline use, and a full-screen experience."
            : "This app can now reopen without a network connection."}
        </span>
      </div>
      <div className="pwa-banner__actions">
        {showUpdate ? (
          <>
            <button className="pwa-banner__button pwa-banner__button--primary" onClick={applyServiceWorkerUpdate}>
              Refresh
            </button>
            <button className="pwa-banner__button" onClick={() => setUpdateDismissed(true)}>
              Later
            </button>
          </>
        ) : showInstall ? (
          <>
            <button className="pwa-banner__button pwa-banner__button--primary" onClick={() => void installApp()}>
              Install
            </button>
            <button className="pwa-banner__button" onClick={dismissInstallPrompt}>
              Not now
            </button>
          </>
        ) : (
          <button className="pwa-banner__button pwa-banner__button--primary" onClick={dismissOfflineReady}>
            Got it
          </button>
        )}
      </div>
    </div>
  );
}

export default PwaBanner;
