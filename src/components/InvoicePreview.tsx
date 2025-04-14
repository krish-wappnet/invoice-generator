import { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice, Client } from '../types';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    flexDirection: 'column',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  total: {
    fontWeight: 'bold',
  },
});

// PDF Document Component
const PDFInvoice = ({ invoice, client }: { invoice: Invoice; client?: Client | null }) => {
  const calculateTotal = () => {
    let total = invoice.total || 0;
    if (invoice.tax) total += (total * invoice.tax) / 100;
    if (invoice.discount) total -= (total * invoice.discount) / 100;
    return total.toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice #{invoice.invoiceNumber}</Text>
        {client && (
          <View style={styles.section}>
            <Text>{client.name}</Text>
            <Text>{client.email}</Text>
            <Text>{client.address}</Text>
            {client.gst && <Text>GST: {client.gst}</Text>}
          </View>
        )}
        <View style={styles.section}>
          <Text>Date: {invoice.date}</Text>
          <Text>Due Date: {invoice.dueDate}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Description</Text>
            <Text style={styles.tableCol}>Quantity</Text>
            <Text style={styles.tableCol}>Rate</Text>
            <Text style={styles.tableCol}>Total</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.description}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>
                {invoice.currency} {item.rate}
              </Text>
              <Text style={styles.tableCol}>
                {invoice.currency} {item.total}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Subtotal: {invoice.currency} {invoice.total || 0}</Text>
          {invoice.tax && (
            <Text>
              Tax ({invoice.tax}%): {invoice.currency}{' '}
              {((invoice.total || 0) * invoice.tax) / 100}
            </Text>
          )}
          {invoice.discount && (
            <Text>
              Discount ({invoice.discount}%): {invoice.currency}{' '}
              {((invoice.total || 0) * invoice.discount) / 100}
            </Text>
          )}
          <Text style={styles.total}>
            Total: {invoice.currency} {calculateTotal()}
          </Text>
        </View>
        {invoice.notes && (
          <View style={styles.section}>
            <Text>Notes: {invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Original Component for UI Rendering
interface InvoicePreviewProps {
  invoice: Invoice;
  client?: Client | null | undefined; // Updated to accept null or undefined
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>((props, ref) => {
  const { invoice, client } = props;

  const calculateTotal = () => {
    let total = invoice.total || 0;
    if (invoice.tax) total += (total * invoice.tax) / 100;
    if (invoice.discount) total -= (total * invoice.discount) / 100;
    return total.toFixed(2);
  };

  return (
    <div ref={ref} className={`p-8 ${invoice.template === 'Modern' ? 'bg-gray-100' : 'bg-white'} border`} style={{ backgroundColor: '#f7fafc' }}>
      <h1 className="text-3xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
      {client && (
        <div className="mt-4">
          <h2>{client.name}</h2>
          <p>{client.email}</p>
          <p>{client.address}</p>
          {client.gst && <p>GST: {client.gst}</p>}
        </div>
      )}
      <div className="mt-4">
        <p>Date: {invoice.date}</p>
        <p>Due Date: {invoice.dueDate}</p>
      </div>
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Description</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">
                {invoice.currency} {item.rate}
              </td>
              <td className="border p-2">
                {invoice.currency} {item.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p>Subtotal: {invoice.currency} {invoice.total || 0}</p>
        {invoice.tax && (
          <p>
            Tax ({invoice.tax}%): {invoice.currency}{' '}
            {((invoice.total || 0) * invoice.tax) / 100}
          </p>
        )}
        {invoice.discount && (
          <p>
            Discount ({invoice.discount}%): {invoice.currency}{' '}
            {((invoice.total || 0) * invoice.discount) / 100}
          </p>
        )}
        <p className="font-bold">
          Total: {invoice.currency} {calculateTotal()}
        </p>
      </div>
      {invoice.notes && (
        <div className="mt-4">
          <h3>Notes</h3>
          <p>{invoice.notes}</p>
        </div>
      )}
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
export { PDFInvoice };