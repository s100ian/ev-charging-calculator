import { useEffect, useState } from "react";
import {
  applyServiceWorkerUpdate,
  dismissOfflineReady,
  subscribeToPwaState,
  type PwaState,
} from "../pwa";

const initialState: PwaState = {
  updateAvailable: false,
  offlineReady: false,
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
  const showOfflineReady = pwaState.offlineReady;

  if (!showUpdate && !showOfflineReady) {
    return null;
  }

  return (
    <div className="pwa-banner" role="status" aria-live="polite">
      <div className="pwa-banner__content">
        <strong className="pwa-banner__title">
          {showUpdate ? "Update available" : "Ready offline"}
        </strong>
        <span className="pwa-banner__message">
          {showUpdate
            ? "A new version of EV Charging Calculator is ready to install."
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
