'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { PDFComponents } from './PDFComponents';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

interface InvoiceData {
  general: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    language: string;
  };
  seller: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    accountNumber: string;
    swiftBic: string;
  };
  buyer: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
  };
  items: InvoiceItem[];
  template: 'default' | 'stripe';
}

interface ClientPDFWrapperProps {
  data: InvoiceData;
  isFormValid: boolean;
}

export const ClientPDFWrapper: React.FC<ClientPDFWrapperProps> = ({ data, isFormValid }) => {
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <button
          disabled
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
        >
          <Eye className="h-4 w-4" />
          <span>Preview PDF</span>
        </button>
        <button
          disabled
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
        >
          <span>Generate PDF</span>
        </button>
      </div>
    }>
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setShowPDFPreview(true)}
          disabled={!isFormValid}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Eye className="h-4 w-4" />
          <span>Preview PDF</span>
        </button>
        
        {isFormValid && (
          <PDFComponents
            data={data}
            showPreview={showPDFPreview}
            onClosePreview={() => setShowPDFPreview(false)}
          />
        )}
      </div>
    </ClientOnly>
  );
};
