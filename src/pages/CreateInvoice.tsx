import React, { useEffect, useRef, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePreview from '../components/InvoicePreview'; // UI component
import { PDFInvoice } from '../components/InvoicePreview'; // PDF component
import { Invoice } from '../types';
import { format } from 'date-fns';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoice } from '../context/InvoiceContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import ArrowLeftIcon

const CreateInvoice: React.FC = () => {
  const { addInvoice, getNextInvoiceNumber, clients } = useInvoice();
  const [isPreview, setIsPreview] = useState(false);
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    items: [], // Default to empty array to avoid undefined
    total: 0,
    status: 'Draft',
    template: 'Modern',
    currency: 'USD',
  });
  const componentRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const invoiceNumber = await getNextInvoiceNumber();
        setInvoice((prev) => ({ ...prev, invoiceNumber: invoiceNumber || 'TEMP-0001' }));
      } catch (error) {
        console.error('Failed to fetch invoice number:', error);
        setInvoice((prev) => ({ ...prev, invoiceNumber: 'TEMP-0001' }));
      }
    };
    fetchInvoiceNumber();
  }, [getNextInvoiceNumber]);

  const handleSubmit = async () => {
    const requiredFields: (keyof Invoice)[] = ['invoiceNumber', 'clientId', 'items', 'date', 'dueDate', 'status', 'template', 'currency', 'total'];
    const missingFields = requiredFields.filter((field) => !invoice[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsPreview(false);
  };

  const handleBack = () => {
    navigate('/'); // Navigate to root route
  };

  // Ensure invoice is valid before rendering PDFDownloadLink
  const isInvoiceValidForPDF = !!invoice.invoiceNumber && (invoice.items?.length || 0) > 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Create Invoice</h1>
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={isSubmitting}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-4 py-2 rounded ${isPreview ? 'bg-gray-500' : 'bg-blue-500'} text-white hover:bg-${isPreview ? 'gray-600' : 'blue-600'} transition duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isPreview ? 'Back to Editing' : 'Preview'}
        </button>
        {isPreview && (
          <button
            onClick={handleCancel}
            className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
      {isPreview ? (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Preview Draft</h2>
          <InvoicePreview ref={componentRef} invoice={invoice as Invoice} />
          <div className="mt-4">
            {isInvoiceValidForPDF ? (
              <PDFDownloadLink
                document={<PDFInvoice invoice={invoice as Invoice} />}
                fileName={`invoice_${invoice.invoiceNumber}.pdf`}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              >
                {({ loading }) => (loading || isSubmitting ? 'Generating...' : 'Download PDF')}
              </PDFDownloadLink>
            ) : (
              <p className="text-red-500">Invoice data is incomplete for PDF generation.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Editing Draft</h2>
          <InvoiceForm
            invoice={invoice as Invoice}
            setInvoice={(newInvoice: Partial<Invoice>) => setInvoice(newInvoice)}
            onSubmit={handleSubmit}
            clients={clients}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;