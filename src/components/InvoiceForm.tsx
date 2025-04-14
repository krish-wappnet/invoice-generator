import { useState, useEffect } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Invoice, InvoiceItem } from '../types';

interface InvoiceFormProps {
  invoice: Partial<Invoice>;
  setInvoice: (invoice: Partial<Invoice>) => void;
  onSubmit: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice, onSubmit }) => {
  const { clients } = useInvoice();
  const [item, setItem] = useState<InvoiceItem>({
    description: '',
    quantity: 1,
    rate: 0,
    total: 0,
  });

  const addItem = () => {
    const itemTotal = item.quantity * item.rate;
    const updatedItems = [...(invoice.items || []), { ...item, total: itemTotal }];
    updateTotal(updatedItems, invoice.tax, invoice.discount);
    setItem({ description: '', quantity: 1, rate: 0, total: 0 });
  };

  const updateTotal = (items: InvoiceItem[], tax?: number, discount?: number) => {
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    let newTotal = subtotal;
    if (tax) newTotal += (subtotal * tax) / 100;
    if (discount) newTotal -= (subtotal * discount) / 100;
    setInvoice({ ...invoice, items, total: newTotal >= 0 ? newTotal : 0 });
    console.log('Updated invoice state:', { ...invoice, items, total: newTotal }); // Debug
  };

  useEffect(() => {
    updateTotal(invoice.items || [], invoice.tax, invoice.discount);
  }, [invoice.items, invoice.tax, invoice.discount]);

  const handleSubmit = () => {
    updateTotal(invoice.items || [], invoice.tax, invoice.discount); // Force final recalc
    console.log('Submitting invoice:', invoice); // Debug before submission
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <select
        value={invoice.clientId || ''}
        onChange={(e) => setInvoice({ ...invoice, clientId: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={invoice.date || ''}
        onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={invoice.dueDate || ''}
        onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Description"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={item.quantity}
          onChange={(e) => setItem({ ...item, quantity: parseInt(e.target.value) || 1 })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Rate"
          value={item.rate}
          onChange={(e) => setItem({ ...item, rate: parseFloat(e.target.value) || 0 })}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Item
        </button>
      </div>

      <div>
        {(invoice.items || []).map((item, index) => (
          <div key={index} className="flex justify-between p-2 border-b">
            <span>{item.description}</span>
            <span>
              {item.quantity} x {item.rate} = {item.total}
            </span>
          </div>
        ))}
      </div>

      <input
        type="number"
        placeholder="Tax (%)"
        value={invoice.tax || ''}
        onChange={(e) =>
          setInvoice({ ...invoice, tax: parseFloat(e.target.value) || undefined })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Discount (%)"
        value={invoice.discount || ''}
        onChange={(e) =>
          setInvoice({ ...invoice, discount: parseFloat(e.target.value) || undefined })
        }
        className="w-full p-2 border rounded"
      />

      <select
        value={invoice.currency || 'USD'}
        onChange={(e) =>
          setInvoice({ ...invoice, currency: e.target.value as 'INR' | 'USD' | 'EUR' })
        }
        className="w-full p-2 border rounded"
      >
        <option value="USD">USD</option>
        <option value="INR">INR</option>
        <option value="EUR">EUR</option>
      </select>

      <select
        value={invoice.template || 'Modern'}
        onChange={(e) =>
          setInvoice({ ...invoice, template: e.target.value as 'Modern' | 'Classic' })
        }
        className="w-full p-2 border rounded"
      >
        <option value="Modern">Modern</option>
        <option value="Classic">Classic</option>
      </select>

      <textarea
        placeholder="Notes"
        value={invoice.notes || ''}
        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        Save Invoice
      </button>
    </div>
  );
};

export default InvoiceForm;