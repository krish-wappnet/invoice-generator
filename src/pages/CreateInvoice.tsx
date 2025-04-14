import React, { useEffect, useRef, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePreview from '../components/InvoicePreview'; // UI component
import { PDFInvoice } from '../components/InvoicePreview'; // PDF component
import { Invoice } from '../types';
import { format } from 'date-fns';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoice } from '../context/InvoiceContext';
// Removed generatePDF import since @react-pdf/renderer handles it

const CreateInvoice: React.FC = () => {
  const { addInvoice, getNextInvoiceNumber } = useInvoice();
  const [isPreview, setIsPreview] = useState(false);
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    items: [],
    total: 0,
    status: 'Draft',
    template: 'Modern',
    currency: 'USD',
  });

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      const invoiceNumber = await getNextInvoiceNumber();
      setInvoice((prev) => ({ ...prev, invoiceNumber }));
    };
    fetchInvoiceNumber();
  }, [getNextInvoiceNumber]);

  const handleSubmit = async () => {
    if (
      !invoice.invoiceNumber ||
      !invoice.clientId ||
      !invoice.items?.length ||
      !invoice.date ||
      !invoice.dueDate ||
      !invoice.status ||
      !invoice.template ||
      !invoice.currency ||
      invoice.total === undefined
    ) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await addInvoice(invoice as Omit<Invoice, 'id'>);
      const newInvoiceNumber = await getNextInvoiceNumber();
      setInvoice({
        clientId: '',
        invoiceNumber: newInvoiceNumber,
        date: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        items: [],
        total: 0,
        status: 'Draft',
        template: 'Modern',
        currency: 'USD',
      });
      alert('Invoice created successfully');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to create invoice. The invoice number may already exist.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <button
        onClick={() => setIsPreview(!isPreview)}
        className="mb-4 bg-gray-500 text-white p-2 rounded"
      >
        {isPreview ? 'Edit' : 'Preview'}
      </button>
      {isPreview ? (
        <div>
          <InvoicePreview ref={componentRef} invoice={invoice as Invoice} />
          <PDFDownloadLink document={<PDFInvoice invoice={invoice as Invoice} />} fileName={`invoice_${invoice.invoiceNumber}.pdf`}>
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
          </PDFDownloadLink>
        </div>
      ) : (
        <InvoiceForm
          invoice={invoice as Invoice}
          setInvoice={(newInvoice: Partial<Invoice>) => setInvoice(newInvoice)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CreateInvoice;