import { useInvoice } from '../context/InvoiceContext';
import { isPast } from 'date-fns';
import { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Invoices: React.FC = () => {
  const { invoices, updateInvoice } = useInvoice();

  useEffect(() => {
    invoices.forEach((invoice) => {
      if (invoice.status === 'Sent' && isPast(new Date(invoice.dueDate))) {
        updateInvoice(invoice.id, { ...invoice, status: 'Overdue' }); // Removed !
      }
    });
  }, [invoices, updateInvoice]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Invoice #</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id.toString()}> {/* Convert to string for key */}
              <td className="border p-2">{invoice.invoiceNumber}</td>
              <td className="border p-2">
                {invoice.clientId} {/* Replace with client name lookup if available */}
              </td>
              <td className="border p-2">{invoice.date}</td>
              <td className="border p-2">{invoice.dueDate}</td>
              <td className="border p-2">
                {invoice.currency} {invoice.total}
              </td>
              <td className="border p-2">
                <select
                  value={invoice.status}
                  onChange={(e) =>
                    updateInvoice(invoice.id, {
                      ...invoice,
                      status: e.target.value as 'Draft' | 'Sent' | 'Paid' | 'Overdue',
                    })
                  }
                  className="p-1 border rounded"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </td>
              <td className="border p-2">
                <Link
                  to={`/preview/${invoice.id.toString()}`} // Convert to string for URL
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                >
                  Preview
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;