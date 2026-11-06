import { useState, useEffect } from 'react';

/**
 * PWA Install Banner
 * - Android/Chrome: Shows native install prompt via beforeinstallprompt
 * - iOS Safari: Shows manual "Add to Home Screen" instructions
 * - Already installed: Hides itself
 */
export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  const [showIOSBanner, setShowIOSBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed as PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Don't show if user dismissed recently
    const lastDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
      return; // Hidden for 7 days
    }

    // Detect iOS Safari
    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      setShowIOSBanner(true);
      return;
    }

    // Android/Chrome: Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowAndroidBanner(false);
    setShowIOSBanner(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  if (dismissed) return null;

  // Android install banner
  if (showAndroidBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-800 text-white shadow-2xl animate-slide-up">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">install_mobile</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install Nagar Connect App</p>
            <p className="text-xs text-blue-200 mt-0.5">Works offline • No app store needed</p>
          </div>
          <button
            onClick={handleInstall}
            className="flex-shrink-0 bg-white text-blue-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-blue-200 hover:text-white"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari install instructions
  if (showIOSBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-800 text-white shadow-2xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">install_mobile</span>
              <p className="font-semibold text-sm">Install Nagar Connect</p>
            </div>
            <button onClick={handleDismiss} className="text-blue-200 hover:text-white p-1">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Tap the{' '}
            <span className="inline-flex items-center bg-white/20 rounded px-1 py-0.5 mx-0.5">
              <span className="material-symbols-outlined text-xs">ios_share</span>
            </span>{' '}
            Share button, then tap <strong>"Add to Home Screen"</strong> to install this app on your iPhone.
          </p>
          {/* Arrow pointing to Safari share button */}
          <div className="mt-2 flex justify-center">
            <div className="text-blue-200 text-xs flex items-center gap-1 animate-bounce">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              <span>Tap Share below</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
