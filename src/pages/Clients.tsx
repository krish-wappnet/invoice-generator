import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import ClientForm from '../components/ClientForm';
import { Client } from '../types'; // Ensure this import matches your types file

const Clients: React.FC = () => {
  const { clients, addClient, deleteClient, updateClient } = useInvoice();
  const [isLoading, setIsLoading] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setIsLoading(true);
      deleteClient(id)
        .catch((error) => console.error('Delete failed:', error))
        .finally(() => setIsLoading(false));
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
      </div>
      <div className="mb-6">
        <ClientForm
          onSubmit={async (clientData: Omit<Client, 'id'>) => {
            setIsLoading(true);
            try {
              if (editingClient) {
                await updateClient(editingClient.id!, clientData); // Non-null assertion since editingClient is checked
              } else {
                await addClient(clientData);
              }
              setEditingClient(null);
            } catch (error) {
              console.error('Submission failed:', error);
              alert('Failed to save client. Please check the form and try again.');
            } finally {
              setIsLoading(false);
            }
          }}
          initialData={editingClient}
          isLoading={isLoading}
        />
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Name</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Email</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Address</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">GST</th>
              <th className="border-b p-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="border-b p-3">{client.name}</td>
                <td className="border-b p-3">{client.email}</td>
                <td className="border-b p-3">{client.address}</td>
                <td className="border-b p-3">{client.gst || 'N/A'}</td>
                <td className="border-b p-3 flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 text-sm"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id as string)} // Type assertion to ensure string
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
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

export default Clients;