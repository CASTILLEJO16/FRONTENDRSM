import React from "react";
import { X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QRModal({ cliente, onClose }) {
  if (!cliente) return null;

  // 🔥 URL que apunta a tu app + el ID del cliente
  // Cuando alguien escanee el QR, irá a esta URL
  const qrValue = `${window.location.origin}/scan/${cliente._id}`;

  // Función para descargar el QR como imagen
  const descargarQR = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${cliente.nombre.replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Código QR - {cliente.nombre}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg flex justify-center">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue}
              size={250}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Info */}
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-300 mb-2">
              <strong className="text-slate-100">Cliente:</strong> {cliente.nombre}
            </p>
            <p className="text-sm text-slate-300 mb-2">
              <strong className="text-slate-100">Teléfono:</strong> {cliente.telefono}
            </p>
            {cliente.empresa && (
              <p className="text-sm text-slate-300">
                <strong className="text-slate-100">Empresa:</strong> {cliente.empresa}
              </p>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-900/20 border border-blue-800/50 p-3 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 <strong>Instrucciones:</strong> Al escanear este código QR, 
              se abrirá automáticamente el formulario para enviar mensajes a este cliente.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={descargarQR}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-2 rounded transition-colors text-white font-medium"
            >
              <Download size={18} />
              Descargar QR
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}