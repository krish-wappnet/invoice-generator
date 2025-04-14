import { useState, Component, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext'; // Adjust path
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateInvoice from './pages/CreateInvoice';
import InvoicePreview from './components/InvoicePreview'; // Verify this path
import { useParams } from 'react-router-dom';
import { useInvoice } from './context/InvoiceContext'; // Adjust path
import { Invoice } from './types'; // Import updated Invoice type

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre> {/* Include stack trace */}
        </div>
      );
    }
    return this.props.children;
  }
}

// New component for preview page
const InvoicePreviewPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoices } = useInvoice();

  console.log('InvoicePreviewPage rendering with invoiceId:', invoiceId, 'invoices:', invoices); // Debug log

  if (!invoices.length) {
    return <div>Loading invoices... or no invoices available</div>; // Handle empty state
  }

  const invoice = invoices.find((inv: Invoice) => {
    console.log('Comparing invoiceId:', typeof invoiceId, invoiceId, 'with inv.id:', typeof inv.id, inv.id); // Debug types
    if (inv.id === undefined || inv.id === null) {
      console.error('Invoice with invalid id found:', inv);
      return false;
    }
    return inv.id.toString() === invoiceId; // Convert inv.id to string for comparison
  });

  if (!invoice) {
    console.error('Invoice not found for ID:', invoiceId, 'Available IDs:', invoices.map((inv) => inv.id?.toString()));
    return <div>Invoice not found for ID: {invoiceId}. Available IDs: {invoices.map((inv) => inv.id?.toString()).join(', ')}</div>;
  }

  return (
    <ErrorBoundary>
      <InvoicePreview invoice={invoice} />
    </ErrorBoundary>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <InvoiceProvider>
        <BrowserRouter>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded"
          >
            Toggle Dark Mode
          </button>
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/preview/:invoiceId" element={<InvoicePreviewPage />} />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </div>
  );
}

export default App;