import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Invoice, Client } from '../types';
import InvoicePreview from '../components/InvoicePreview';
import { PDFInvoice } from '../components/InvoicePreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generatePDF } from '../lib/pdf'; // Ensure this import is correct

const InvoicePreviewPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoices, clients, loading } = useInvoice();
  const previewRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    console.log('InvoicePreviewPage useEffect triggered with invoiceId:', invoiceId, 'invoices:', invoices, 'loading:', loading);
    if (!loading && invoices.length > 0) {
      const foundInvoice = invoices.find((inv: Invoice) => inv.id?.toString() === invoiceId);
      setInvoice(foundInvoice || null);
      if (foundInvoice) {
        const foundClient = clients.find((c) => c.id === foundInvoice.clientId);
        setClient(foundClient || null);
      }
    }
  }, [invoiceId, invoices, clients, loading]);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (!invoice) {
    console.error('Invoice not found for ID:', invoiceId, 'Available IDs:', invoices.map((inv) => inv.id?.toString()));
    return <div>Invoice not found for ID: {invoiceId}. Available IDs: {invoices.map((inv) => inv.id?.toString()).join(', ')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <InvoicePreview ref={previewRef} invoice={invoice} client={client} />
      <div className="mt-4 space-x-4">
        <PDFDownloadLink
          document={<PDFInvoice invoice={invoice} client={client} />}
          fileName={`invoice_${invoice.invoiceNumber || 'temp'}.pdf`}
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