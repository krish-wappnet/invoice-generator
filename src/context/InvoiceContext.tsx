/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Client, Invoice } from '../types';

interface InvoiceContextType {
  clients: Client[];
  invoices: Invoice[];
  loading: boolean;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<string>;
  updateInvoice: (id: string | number, invoice: Omit<Invoice, 'id'>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getNextInvoiceNumber: () => Promise<string>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientData, invoiceData] = await Promise.all([db.clients.toArray(), db.invoices.toArray()]);
        setClients(clientData);
        setInvoices(invoiceData.map((i) => ({ ...i, id: String(i.id) })));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      console.log('Adding client:', client);
      const existing = await db.clients.where('email').equalsIgnoreCase(client.email).first();
      if (existing) {
        throw new Error(`Client with email ${client.email} already exists`);
      }
      const id = await db.clients.add(client);
      setClients([...clients, { ...client, id: String(id) }]);
    } catch (error) {
      console.error('Failed to add client:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, client: Omit<Client, 'id'>) => {
    try {
      await db.clients.update(Number(id), client);
      setClients(clients.map((c) => (c.id === id ? { ...client, id } : c)));
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await db.clients.delete(Number(id));
      setClients(clients.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    try {
      console.log('Adding invoice (input):', invoice);

      const requiredFields: (keyof Omit<Invoice, 'id'>)[] = [
        'clientId',
        'invoiceNumber',
        'date',
        'dueDate',
        'items',
        'total',
        'status',
        'template',
        'currency',
      ];
      const missingFields = requiredFields.filter((field) => !invoice[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      let finalInvoice = invoice;
      const existing = await db.invoices.where('invoiceNumber').equals(invoice.invoiceNumber).first();
      if (existing) {
        console.warn(`Invoice ${invoice.invoiceNumber} exists, generating new number`);
        const newNumber = await getNextInvoiceNumber();
        finalInvoice = { ...invoice, invoiceNumber: newNumber };
      }
      const id = await db.invoices.add(finalInvoice as Invoice);
      const updatedInvoices = await db.invoices.toArray();
      setInvoices(updatedInvoices.map((i) => ({ ...i, id: String(i.id) })));
      return String(id);
    } catch (error) {
      console.error('Failed to add invoice:', error);
      throw error;
    }
  };

  const updateInvoice = async (id: string | number, invoice: Omit<Invoice, 'id'>) => {
    try {
      await db.invoices.update(Number(id), invoice);
      const updatedInvoices = await db.invoices.toArray();
      setInvoices(updatedInvoices.map((i) => ({ ...i, id: String(i.id) })));
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await db.invoices.delete(Number(id));
      setInvoices(invoices.filter((i) => i.id !== id));
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  };

  const getNextInvoiceNumber = async () => {
    const allInvoices = await db.invoices.toArray();
    const maxNumber = allInvoices.reduce((max, inv) => {
      const num = parseInt(inv.invoiceNumber.replace('INV-', '')) || 0;
      return Math.max(max, num);
    }, 0);
    return `INV-${(maxNumber + 1).toString().padStart(4, '0')}`;
  };

  return (
    <InvoiceContext.Provider
      value={{
        clients,
        invoices,
        loading,
        addClient,
        updateClient,
        deleteClient,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getNextInvoiceNumber,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error('useInvoice must be used within InvoiceProvider');
  return context;
};