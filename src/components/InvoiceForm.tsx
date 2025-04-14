import React, { useEffect, useState } from 'react';
import { Invoice, InvoiceItem, Client } from '../types';

interface InvoiceFormProps {
  invoice: Partial<Invoice>;
  setInvoice: (invoice: Partial<Invoice>) => void;
  onSubmit: () => void;
  clients: Client[];
  isSubmitting: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice, onSubmit, clients, isSubmitting }) => {
  const [item, setItem] = useState<InvoiceItem>({
    description: '',
    quantity: 1,
    rate: 0,
    total: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!invoice.clientId) newErrors.clientId = 'Client is required';
    if (!invoice.date) newErrors.date = 'Date is required';
    if (!invoice.dueDate) newErrors.dueDate = 'Due Date is required';
    if (invoice.date && invoice.dueDate && new Date(invoice.dueDate) <= new Date(invoice.date)) {
      newErrors.dueDate = 'Due Date must be after Invoice Date';
    }
    if (!invoice.items?.length) newErrors.items = 'At least one item is required';
    if (invoice.items?.some((i) => !i.description || i.quantity <= 0 || i.rate < 0)) {
      newErrors.items = 'All items must have a description, positive quantity, and non-negative rate';
    }
    if ((invoice.tax !== undefined && invoice.tax < 0) || (invoice.discount !== undefined && invoice.discount < 0)) {
      newErrors.taxOrDiscount = 'Tax and Discount must be non-negative';
    }
    return newErrors;
  };

  const updateTotal = (items: InvoiceItem[] = [], tax?: number, discount?: number) => {
    const subtotal = items.reduce((sum, i) => sum + (i.total || i.quantity * i.rate), 0);
    let newTotal = subtotal;
    if (tax !== undefined && tax >= 0) newTotal += (subtotal * tax) / 100;
    if (discount !== undefined && discount >= 0) newTotal -= (subtotal * discount) / 100;
    setInvoice({ ...invoice, items, total: newTotal >= 0 ? newTotal : 0 });
  };

  const addItem = () => {
    if (!item.description || item.quantity <= 0 || item.rate < 0) {
      setErrors({ ...errors, items: 'Description is required, quantity must be positive, and rate must be non-negative' });
      return;
    }
    const itemTotal = item.quantity * item.rate;
    const updatedItems = [...(invoice.items || []), { ...item, total: itemTotal }];
    updateTotal(updatedItems, invoice.tax, invoice.discount);
    setItem({ description: '', quantity: 1, rate: 0, total: 0 });
    setErrors((prev) => ({ ...prev, items: '' }));
  };

  const removeItem = (index: number) => {
    const updatedItems = (invoice.items || []).filter((_, i) => i !== index);
    updateTotal(updatedItems, invoice.tax, invoice.discount);
  };

  useEffect(() => {
    updateTotal(invoice.items || [], invoice.tax, invoice.discount);
  }, [invoice.items, invoice.tax, invoice.discount]);

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 gap-6 bg-white shadow-md rounded-lg p-6">
        {/* Client Section */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <select
                value={invoice.clientId || ''}
                onChange={(e) => setInvoice({ ...invoice, clientId: e.target.value })}
                className={`w-full p-2 border rounded mt-1 ${errors.clientId ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>}
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
              <input
                type="date"
                value={invoice.date || ''}
                onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                className={`w-full p-2 border rounded mt-1 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={invoice.dueDate || ''}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                className={`w-full p-2 border rounded mt-1 ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
                className={`p-2 border rounded col-span-2 ${errors.items ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => setItem({ ...item, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className={`p-2 border rounded ${errors.items ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => setItem({ ...item, rate: Math.max(0, parseFloat(e.target.value) || 0) })}
                className={`p-2 border rounded ${errors.items ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              <button
                onClick={addItem}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Add Item
              </button>
            </div>
            {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}

            <div className="border rounded p-2 mt-2">
              <h3 className="text-lg font-medium mb-2">Items List</h3>
              {(invoice.items || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <span>{item.description} ({item.quantity} x {item.rate} = {item.total})</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 transition duration-200 disabled:text-gray-400"
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totals and Options Section */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Totals & Options</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
              <input
                type="number"
                placeholder="Tax (%)"
                value={invoice.tax || ''}
                onChange={(e) => setInvoice({ ...invoice, tax: parseFloat(e.target.value) || undefined })}
                className={`w-full p-2 border rounded mt-1 ${errors.taxOrDiscount ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                placeholder="Discount (%)"
                value={invoice.discount || ''}
                onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) || undefined })}
                className={`w-full p-2 border rounded mt-1 ${errors.taxOrDiscount ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
            </div>
          </div>
          {errors.taxOrDiscount && <p className="text-red-500 text-sm mt-1">{errors.taxOrDiscount}</p>}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={invoice.currency || 'USD'}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value as 'USD' | 'INR' | 'EUR' })}
              className="w-full p-2 border rounded mt-1 border-gray-300"
              disabled={isSubmitting}
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Template</label>
            <select
              value={invoice.template || 'Modern'}
              onChange={(e) => setInvoice({ ...invoice, template: e.target.value as 'Modern' | 'Classic' })}
              className="w-full p-2 border rounded mt-1 border-gray-300"
              disabled={isSubmitting}
            >
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              placeholder="Notes"
              value={invoice.notes || ''}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
              className="w-full p-2 border rounded mt-1 border-gray-300"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="col-span-1 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;