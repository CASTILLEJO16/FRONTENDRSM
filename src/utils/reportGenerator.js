
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un reporte general de ventas en PDF
 * @param {Array} clients - Lista de clientes con sus ventas
 * @param {String} title - Título del reporte
 */
export const generateSalesReport = (clients, title = "Reporte General de Ventas") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ... (encabezado omitido en el target content para brevedad, pero se mantiene)
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text("RSM - Sistema de Ventas", pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Generado el: ${new Date().toLocaleString()}`, pageWidth / 2, 38, { align: 'center' });

  // Preparar datos para la tabla
  const tableRows = [];
  let totalGeneral = 0;

  clients.forEach(client => {
    (client.ventas || []).forEach(venta => {
      const monto = Number(venta.monto || 0);
      totalGeneral += monto;
      tableRows.push([
        new Date(venta.fecha).toLocaleDateString(),
        client.nombre,
        venta.producto || 'Producto',
        `$${monto.toLocaleString()}`,
        client.vendedor?.nombre || client.vendedor?.username || 'N/A'
      ]);
    });
  });

  // Generar tabla usando la función autoTable directamente
  autoTable(doc, {
    startY: 45,
    head: [['Fecha', 'Cliente', 'Producto/Servicio', 'Monto', 'Vendedor']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600
    alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
    margin: { top: 45 },
    didDrawPage: (data) => {
      // Pie de página
      doc.setFontSize(8);
      doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
    }
  });

  // Total final
  const finalY = doc.lastAutoTable.finalY || 45;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`TOTAL GENERAL: $${totalGeneral.toLocaleString()}`, pageWidth - 20, finalY + 15, { align: 'right' });

  // Descargar
  doc.save(`Reporte_Ventas_${new Date().getTime()}.pdf`);
};

/**
 * Genera un recibo individual para una venta
 * @param {Object} client - Datos del cliente
 * @param {Object} sale - Datos de la venta
 */
export const generateSaleReceipt = (client, sale) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 150] // Formato ticket
  });

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("RSM VENTAS", 40, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text("RECIBO DE VENTA", 40, 22, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(10, 25, 70, 25);

  // Datos del Cliente
  doc.setFontSize(8);
  doc.text(`Fecha: ${new Date(sale.fecha).toLocaleString()}`, 10, 32);
  doc.text(`Cliente: ${client.nombre}`, 10, 37);
  if (client.empresa) doc.text(`Empresa: ${client.empresa}`, 10, 42);
  
  doc.line(10, 45, 70, 45);

  // Detalle
  doc.setFont(undefined, 'bold');
  doc.text("CONCEPTO", 10, 52);
  doc.text("TOTAL", 70, 52, { align: 'right' });
  
  doc.setFont(undefined, 'normal');
  doc.text(sale.producto || 'Venta de Producto', 10, 60);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`$${Number(sale.monto).toLocaleString()}`, 70, 70, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text("¡Gracias por su compra!", 40, 90, { align: 'center' });
  
  // Footer con ID para rastreo
  doc.setFontSize(6);
  doc.setTextColor(150);
  doc.text(`ID Venta: ${sale._id || 'N/A'}`, 40, 100, { align: 'center' });

  doc.save(`Recibo_${client.nombre.replace(/\s+/g, '_')}.pdf`);
};
