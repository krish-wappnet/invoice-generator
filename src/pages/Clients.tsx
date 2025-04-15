import React, { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import ClientForm from '../components/ClientForm';
import { Client } from '../types';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Clients: React.FC = () => {
  const { clients, addClient, deleteClient, updateClient } = useInvoice();
  const [isLoading, setIsLoading] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setIsLoading(true);
      try {
        await deleteClient(id);
        toast.success('Client deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Failed to delete client');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate('/'); // Navigate to root route
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Clients</h1>
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Client Form */}
      <div className="mb-10  text-white rounded-xl shadow-lg p-6 transition-all duration-300">
        <ClientForm
          onSubmit={async (clientData: Omit<Client, 'id'>) => {
            setIsLoading(true);
            try {
              if (editingClient) {
                await updateClient(editingClient.id!, clientData);
                toast.success('Client updated successfully');
              } else {
                await addClient(clientData);
                toast.success('Client added successfully');
              }
              setEditingClient(null);
            } catch (error) {
              console.error('Submission failed:', error);
              toast.error('Failed to save client');
            } finally {
              setIsLoading(false);
            }
          }}
          initialData={editingClient}
          isLoading={isLoading}
        />
      </div>

      {/* Client Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {isLoading && (
          <div className="flex justify-center py-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        )}
        {clients.length === 0 && !isLoading ? (
          <p className="text-center text-black py-6">
            No clients found. Add a new client to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-black mb-2">{client.name}</h3>
                <div className="space-y-2 text-sm text-black">
                  <p>
                    <span className="font-medium">Email:</span> {client.email}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {client.address}
                  </p>
                  <p>
                    <span className="font-medium">GST:</span> {client.gst || 'N/A'}
                  </p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(client)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    disabled={isLoading}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(client.id as string)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    disabled={isLoading}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;