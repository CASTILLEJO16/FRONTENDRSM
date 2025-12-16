import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} instalación`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-indigo-600 text-white rounded-lg shadow-2xl p-4 flex items-start gap-3">
        <Download className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Instalar SalesRSM</h3>
          <p className="text-sm text-indigo-100 mb-3">
            Instala la app para acceso rápido
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-lg"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button onClick={() => setShowInstall(false)} className="text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}