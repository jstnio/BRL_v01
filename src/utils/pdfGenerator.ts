import { jsPDF } from 'jspdf';
import { Shipment } from '../types';
import autoTable from 'jspdf-autotable';

export async function generatePDF(shipment: Shipment) {
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.text('HOUSE BILL OF LADING', pageWidth / 2, 20, { align: 'center' });

  // Add company logo/info
  doc.setFontSize(12);
  doc.text('BRL Logistics', 20, 40);
  doc.text('123 Logistics Way', 20, 45);
  doc.text('New York, NY 10001', 20, 50);
  doc.text('Tel: +1 (555) 123-4567', 20, 55);

  // Add Bill of Lading number
  doc.setFontSize(10);
  doc.text(`B/L No: ${shipment.type === 'ocean' ? shipment.blNumber : shipment.code}`, pageWidth - 60, 40);
  doc.text(`Date: ${new Date(shipment.createdAt).toLocaleDateString()}`, pageWidth - 60, 45);

  // Add shipper and consignee information
  autoTable(doc, {
    startY: 70,
    head: [['Shipper', 'Consignee']],
    body: [[
      `${shipment.shipper?.name || ''}\n${shipment.shipper?.address || ''}\n${shipment.shipper?.phone || ''}`,
      `${shipment.consignee?.name || ''}\n${shipment.consignee?.address || ''}\n${shipment.consignee?.phone || ''}`
    ]],
  });

  // Add routing information
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Port of Loading', 'Port of Discharge']],
    body: [[
      `${shipment.origin?.city || ''}, ${shipment.origin?.country || ''}`,
      `${shipment.destination?.city || ''}, ${shipment.destination?.country || ''}`
    ]],
  });

  // Add cargo details
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Marks & Numbers', 'No. of Packages', 'Description of Goods', 'Gross Weight', 'Measurement']],
    body: shipment.cargo?.map(item => [
      item.marksAndNumbers || '',
      item.numberOfPackages?.toString() || '',
      item.description || '',
      `${item.grossWeight || ''} ${item.weightUnit || ''}`,
      `${item.measurement || ''} ${item.measurementUnit || ''}`
    ]) || [['', '', '', '', '']],
  });

  // Add terms and conditions
  doc.setFontSize(8);
  const terms = `RECEIVED by the Carrier the Goods as specified above in apparent good order and condition 
  unless otherwise stated, to be transported to such place as agreed, authorized or permitted here in and 
  subject to all the terms and conditions appearing on both sides of this Bill of Lading to which the 
  Merchant agrees by accepting this Bill of Lading, any local privileges and customs notwithstanding.`;
  
  doc.text(terms, 20, doc.lastAutoTable.finalY + 20, {
    maxWidth: pageWidth - 40,
    align: 'justify'
  });

  // Add signature fields
  doc.setFontSize(10);
  doc.text('_____________________', 20, doc.internal.pageSize.height - 30);
  doc.text('Carrier Signature', 20, doc.internal.pageSize.height - 25);
  
  doc.text('_____________________', pageWidth - 60, doc.internal.pageSize.height - 30);
  doc.text('Date', pageWidth - 40, doc.internal.pageSize.height - 25);

  // Save the PDF
  doc.save(`HBL_${shipment.type === 'ocean' ? shipment.blNumber : shipment.code}.pdf`);
}
