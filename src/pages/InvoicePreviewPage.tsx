import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Invoice, Client } from '../types';
import InvoicePreview from '../components/InvoicePreview';
import { PDFInvoice } from '../components/InvoicePreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generatePDF } from '../lib/pdf';

const InvoicePreviewPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoices, clients, loading } = useInvoice();
  const previewRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  // Print functionality
  const handlePrint = () => {
    if (previewRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Invoice ${invoice?.invoiceNumber || ''}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${previewRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  // Simulated email sending
  const handleSendEmail = async () => {
    if (!invoice || !client) {
      alert('Invoice or client information is missing.');
      return;
    }

    setIsSendingEmail(true);
    try {
      // Simulate API call to send email
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      
      // This is a simulation - in a real app, you'd make an API call here
      console.log('Simulating email send:', {
        to: client.email,
        subject: `Invoice ${invoice.invoiceNumber} from Your Company`,
        body: `Dear ${client.name},\n\nPlease find attached invoice ${invoice.invoiceNumber}.\n\nBest regards,\nYour Company`,
        attachment: `invoice_${invoice.invoiceNumber}.pdf`,
      });

      alert('Email sent successfully! (This is a simulation)');
    } catch (error) {
      console.error('Email sending simulation failed:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

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
        <button
          onClick={handlePrint}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          disabled={!previewRef.current}
        >
          Print Invoice
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
          disabled={isSendingEmail || !client?.email}
        >
          {isSendingEmail ? 'Sending Email...' : 'Send via Email'}
        </button>
      </div>
    </div>
  );
};

export default InvoicePreviewPage;