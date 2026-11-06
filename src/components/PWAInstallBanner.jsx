import { useState, useEffect } from 'react';

/**
 * Mobile App Install Banner
 * - Direct APK download for Android users with clear installation steps
 * - iOS Safari instructions for iPhone users
 * - Clean UI with dismissal memory
 */
export default function PWAInstallBanner() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running inside installed standalone app (Capacitor or PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      window.Capacitor?.isNativePlatform?.();

    if (isStandalone) return;

    // Check recent dismissal
    const lastDismissed = localStorage.getItem('app-banner-dismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < 3 * 24 * 60 * 60 * 1000) {
      return; // Suppress for 3 days if dismissed
    }

    const ua = navigator.userAgent.toLowerCase();
    const android = /android/i.test(ua);
    const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;

    setIsAndroid(android);
    setIsIOS(ios);
  }, []);

  const handleDownloadAPK = (e) => {
    e?.preventDefault();
    setDownloading(true);

    // Create invisible anchor and trigger browser download manager
    const link = document.createElement('a');
    link.href = '/NagarConnect.apk';
    link.setAttribute('download', 'NagarConnect.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark as downloaded after brief delay
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
    }, 2000);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('app-banner-dismissed', Date.now().toString());
  };

  if (dismissed) return null;

  // iOS Safari Guide
  if (isIOS) {
    return (
      <aside aria-label="Install App for iPhone" className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl border-t border-blue-400/30">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <div>
                <p className="font-bold text-sm leading-tight">Install Nagar Connect App</p>
                <p className="text-[11px] text-blue-200">Mira-Bhayandar Municipal Corp</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-blue-200 hover:text-white p-1 rounded-full" aria-label="Close">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed bg-white/10 p-2.5 rounded-lg border border-white/10">
            To install on iPhone: Tap the <span className="inline-flex items-center bg-white/20 rounded px-1 font-semibold mx-0.5"><span className="material-symbols-outlined text-xs mr-0.5">ios_share</span> Share</span> button in Safari, then select <strong>&quot;Add to Home Screen&quot;</strong>.
          </p>
        </div>
      </aside>
    );
  }

  // Android or Mobile Browser Banner (Primary for Android users)
  if (isAndroid) {
    return (
      <aside aria-label="Install Android App" className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.3)] border-t border-blue-400/30">
        <div className="max-w-lg mx-auto">
          {!downloadComplete ? (
            <div className="flex items-center gap-3">
              <img
                src="/pwa-192x192.png"
                alt="Nagar Connect"
                className="w-12 h-12 rounded-xl shadow-md border border-white/20 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight truncate">Nagar Connect App</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    APK
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5 truncate">
                  Official Android App • 3.7 MB
                </p>
              </div>

              <button
                onClick={handleDownloadAPK}
                disabled={downloading}
                className="shrink-0 bg-white hover:bg-blue-50 active:scale-95 text-blue-900 font-bold text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  {downloading ? 'sync' : 'download'}
                </span>
                <span>{downloading ? 'Downloading...' : 'Install App'}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="shrink-0 p-1 text-blue-300 hover:text-white"
                aria-label="Dismiss banner"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ) : (
            /* Post-Download Step-by-Step Instructions */
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
                  <p className="font-bold text-sm text-white">APK Download Started!</p>
                </div>
                <button onClick={handleDismiss} className="text-blue-200 hover:text-white p-0.5">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-blue-100">
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                  <span className="bg-blue-600 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0">1</span>
                  <span>Pull down notification bar or open <strong>Files &gt; Downloads</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                  <span className="bg-blue-600 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0">2</span>
                  <span>Tap <strong>NagarConnect.apk</strong> and click <strong>Install</strong></span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                <span className="text-blue-300">File: NagarConnect.apk (3.7 MB)</span>
                <button
                  onClick={handleDownloadAPK}
                  className="text-white underline font-semibold hover:text-blue-200"
                >
                  Download again
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Generic desktop / other mobile banner: offer direct download link
  return (
    <aside aria-label="Download App" className="fixed bottom-4 right-4 z-40 hidden md:block">
      <div className="bg-white text-on-surface rounded-2xl shadow-xl border border-outline-variant/40 p-3.5 max-w-sm flex items-center gap-3">
        <img
          src="/pwa-192x192.png"
          alt="Nagar Connect"
          className="w-11 h-11 rounded-xl shadow-xs border border-outline-variant/30 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs text-primary truncate">Nagar Connect Android App</p>
          <p className="text-[11px] text-on-surface-variant truncate">Official MBMC Mobile APK (3.7 MB)</p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href="/NagarConnect.apk"
              download="NagarConnect.apk"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download APK
            </a>
            <span className="text-outline-variant">•</span>
            <a href="/download.html" className="text-xs text-secondary hover:underline">
              Guide
            </a>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-on-surface-variant hover:text-error p-1 self-start"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </aside>
  );
}
