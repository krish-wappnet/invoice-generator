import { useInvoice } from '../context/InvoiceContext';
import ClientForm from '../components/ClientForm';

const Clients: React.FC = () => {
  const { clients, addClient, deleteClient } = useInvoice();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ClientForm onSubmit={addClient} />
      <div className="grid gap-4 mt-4">
        {clients.map((client) => (
          <div key={client.id} className="p-4 border rounded">
            <h2>{client.name}</h2>
            <p>{client.email}</p>
            <p>{client.address}</p>
            <p>{client.gst}</p>
            <button
              onClick={() => deleteClient(client.id!)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;