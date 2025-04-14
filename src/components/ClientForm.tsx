import { useState } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  onSubmit: (client: Client) => void;
  initialClient?: Client;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialClient }) => {
  const [client, setClient] = useState<Client>(
    initialClient || { name: '', email: '', address: '', gst: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(client);
    setClient({ name: '', email: '', address: '', gst: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={client.name}
        onChange={(e) => setClient({ ...client, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={client.email}
        onChange={(e) => setClient({ ...client, email: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Address"
        value={client.address}
        onChange={(e) => setClient({ ...client, address: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="GST Number"
        value={client.gst}
        onChange={(e) => setClient({ ...client, gst: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {initialClient ? 'Update Client' : 'Add Client'}
      </button>
    </form>
  );
};

export default ClientForm;