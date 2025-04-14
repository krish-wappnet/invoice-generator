import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Invoice } from '../types';
import InvoicePreview from '../components/InvoicePreview';
import { PDFInvoice } from '../components/InvoicePreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generatePDF } from '../lib/pdf'; // Ensure this import is correct

const InvoicePreviewPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoices } = useInvoice();
  const previewRef = useRef<HTMLDivElement>(null); // Ref for InvoicePreview content

  console.log('InvoicePreviewPage rendering with invoiceId:', invoiceId, 'invoices:', invoices);

  if (!invoices.length) {
    return <div>Loading invoices... or no invoices available</div>;
  }

  const invoice = invoices.find((inv: Invoice) => {
    console.log('Comparing invoiceId:', typeof invoiceId, invoiceId, 'with inv.id:', typeof inv.id, inv.id);
    if (inv.id === undefined || inv.id === null) {
      console.error('Invoice with invalid id found:', inv);
      return false;
    }
    return inv.id.toString() === invoiceId;
  });

  if (!invoice) {
    console.error('Invoice not found for ID:', invoiceId, 'Available IDs:', invoices.map((inv) => inv.id?.toString()));
    return <div>Invoice not found for ID: {invoiceId}. Available IDs: {invoices.map((inv) => inv.id?.toString()).join(', ')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <InvoicePreview ref={previewRef} invoice={invoice} />
      <div className="mt-4 space-x-4">
        <PDFDownloadLink
          document={<PDFInvoice invoice={invoice} />}
          fileName={`invoice_${invoice.invoiceNumber || 'temp'}.pdf`} // Handle undefined invoiceNumber
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
        </PDFDownloadLink>
        <button
          onClick={() => {
            if (previewRef.current && invoice.invoiceNumber) {
              generatePDF(previewRef.current, invoice.invoiceNumber);
            } else {
              alert('Invoice number or content is not available.');
            }
          }}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={!previewRef.current || !invoice.invoiceNumber}
        >
          Download PDF (Custom)
        </button>
      </div>
    </div>
  );
};

export default InvoicePreviewPage;