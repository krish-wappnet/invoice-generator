import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateInvoice from './pages/CreateInvoice';
import InvoicePreviewPage from './pages/InvoicePreviewPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <InvoiceProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded transition-colors"
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
