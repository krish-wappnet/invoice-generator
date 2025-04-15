import React, { useEffect, useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const Invoices: React.FC = () => {
  const { invoices, updateInvoice, clients, deleteInvoice } = useInvoice();
  const [filterClientId, setFilterClientId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    invoices.forEach((invoice) => {
      if (invoice.status === 'Sent' && dayjs().isAfter(dayjs(invoice.dueDate))) {
        updateInvoice(invoice.id, { ...invoice, status: 'Overdue' });
      }
    });
  }, [invoices, updateInvoice]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesClient = !filterClientId || invoice.clientId === filterClientId;
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    return matchesClient && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      deleteInvoice(id).catch((error) => console.error('Failed to delete invoice:', error));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <div className="space-x-4">
          <Link
            to="/clients"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Create Client
          </Link>
          <Link
            to="/create-invoice"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Create Invoice
          </Link>
        </div>
      </div>
      <div className="mb-4 flex space-x-4">
        <select
          value={filterClientId}
          onChange={(e) => setFilterClientId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Invoice #</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Client</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Date</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Due Date</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Total</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Status</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id.toString()}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="border-b p-3">{invoice.invoiceNumber}</td>
                <td className="border-b p-3">
                  {clients.find((c) => c.id === invoice.clientId)?.name || invoice.clientId}
                </td>
                <td className="border-b p-3">{invoice.date}</td>
                <td className="border-b p-3">{invoice.dueDate}</td>
                <td className="border-b p-3">
                  {invoice.currency} {invoice.total}
                </td>
                <td className="border-b p-3">
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      updateInvoice(invoice.id, {
                        ...invoice,
                        status: e.target.value as 'Draft' | 'Sent' | 'Paid' | 'Overdue',
                      })
                    }
                    className="p-1 border rounded text-sm w-full bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </td>
                <td className="border-b p-3 flex space-x-2">
                  <Link
                    to={`/preview/${invoice.id.toString()}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 text-sm"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id.toString())}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;