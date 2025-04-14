import React, { useState, useEffect } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  onSubmit: (client: Omit<Client, 'id'>) => Promise<void>; // Match Clients.tsx expectation
  initialData?: Client | null; // Rename to match Clients.tsx
  isLoading?: boolean; // Add loading state
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData, isLoading = false }) => {
  const [client, setClient] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    address: '',
    gst: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setClient({
        name: initialData.name,
        email: initialData.email,
        address: initialData.address,
        gst: initialData.gst || '',
      });
      setErrors({}); // Clear errors when editing
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!client.name.trim()) newErrors.name = 'Name is required';
    if (!client.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(client.email)) {
      newErrors.email = 'Email is invalid';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(client).catch((error) => {
        console.error('Submit failed:', error);
        alert('Failed to save client. Please try again.');
      });
      if (!initialData) {
        setClient({ name: '', email: '', address: '', gst: '' }); // Reset only for new client
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Client' : 'Add Client'}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={client.email}
          onChange={(e) => setClient({ ...client, email: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          placeholder="Address"
          value={client.address}
          onChange={(e) => setClient({ ...client, address: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">GST Number (Optional)</label>
        <input
          type="text"
          placeholder="GST Number"
          value={client.gst}
          onChange={(e) => setClient({ ...client, gst: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Client' : 'Add Client'}
      </button>
    </form>
  );
};

export default ClientForm;