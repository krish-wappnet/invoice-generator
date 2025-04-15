import React, { useState, useEffect } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  onSubmit: (client: Omit<Client, 'id'>) => Promise<void>;
  initialData?: Client | null;
  isLoading?: boolean;
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
      setErrors({});
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
      onSubmit(client);
      if (!initialData) {
        setClient({ name: '', email: '', address: '', gst: '' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCancel = () => {
    setClient({ name: '', email: '', address: '', gst: '' });
    setErrors({});
    if (initialData) {
      (document.getElementById('client-form') as HTMLFormElement)?.reset();
    }
  };

  return (
    <form
      id="client-form"
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-900">
        {initialData ? 'Edit Client' : 'Add Client'}
      </h2>

      <div className="relative">
        <input
          type="text"
          id="name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          className="peer w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder=" "
          disabled={isLoading}
        />
        <label
          htmlFor="name"
          className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-blue-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
        >
          Name
        </label>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.name}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="email"
          id="email"
          value={client.email}
          onChange={(e) => setClient({ ...client, email: e.target.value })}
          className="peer w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder=" "
          disabled={isLoading}
        />
        <label
          htmlFor="email"
          className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
        >
          Email
        </label>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <textarea
          id="address"
          value={client.address}
          onChange={(e) => setClient({ ...client, address: e.target.value })}
          className="peer w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder=" "
          rows={4}
          disabled={isLoading}
        />
        <label
          htmlFor="address"
          className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-blue-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
        >
          Address
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          id="gst"
          value={client.gst}
          onChange={(e) => setClient({ ...client, gst: e.target.value })}
          className="peer w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder=" "
          disabled={isLoading}
        />
        <label
          htmlFor="gst"
          className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-blue-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 transition-all"
        >
          GST Number (Optional)
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
          )}
          <span>{isLoading ? 'Saving...' : initialData ? 'Update Client' : 'Add Client'}</span>
        </button>
        {initialData && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ClientForm;