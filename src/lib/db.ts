import Dexie, { Table } from 'dexie';
import { Client, Invoice } from '../types';

class InvoiceDB extends Dexie {
  clients!: Table<Client>;
  invoices!: Table<Invoice>;

  constructor() {
    super('InvoiceDB');
    this.version(1).stores({
      clients: '++id, name, email, address, gst',
      invoices: '++id, clientId, invoiceNumber, date, dueDate, status',
    });
  }
}

export const db = new InvoiceDB();