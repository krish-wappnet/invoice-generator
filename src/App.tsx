import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateInvoice from './pages/CreateInvoice';
import InvoicePreviewPage from './pages/InvoicePreviewPage'; // Updated import

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