export interface Client {
  id?: string; // Optional ID for clients (if needed)
  name: string;
  email: string;
  address: string;
  gst?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  id: string | number; // Required ID, can be string or number
  clientId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  tax?: number;
  discount?: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  notes?: string;
  template: 'Modern' | 'Classic';
  currency: 'INR' | 'USD' | 'EUR';
}