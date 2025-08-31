'use client';

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { ClientOnly } from './ClientOnly';

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
    invoiceNumberPrefix: string;
    invoiceNumberValue: string;
    issueDate: string;
    dueDate: string;
    serviceDate: string;
    currency: string;
    language: string;
    template: 'default' | 'stripe';
    dateFormat: string;
    paymentLinkUrl?: string;
    companyLogo?: string;
  };
  seller: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    accountNumber: string;
    swiftBic: string;
    countryCode: string;
    showVatInPDF: boolean;
    showAccountInPDF: boolean;
    showSwiftInPDF: boolean;
    notes: string;
    showNotesInPDF: boolean;
  };
  buyer: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    countryCode: string;
  };
  items: InvoiceItem[];
  payment: {
    method: string;
    dueDate: string;
    terms: string;
    showMethodInPDF: boolean;
    showDueDateInPDF: boolean;
    showTermsInPDF: boolean;
  };
  notes: {
    content: string;
    showInPDF: boolean;
  };
  signature: {
    showInPDF: boolean;
    name: string;
    title: string;
  };
  template: 'default' | 'stripe';
}

interface PDFPreviewProps {
  data: InvoiceData;
  isFormValid: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data, isFormValid }) => {
  console.log('PDFPreview render:', { isFormValid, data });
  
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading PDF preview...</p>
        </div>
      </div>
    }>
      {isFormValid ? (
        <div className="h-[calc(100vh-12rem)] border border-gray-200 rounded-lg overflow-hidden">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <InvoicePDF data={data} />
          </PDFViewer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">Complete the form to see PDF preview</p>
            <p className="text-xs text-gray-400">Fill in all required fields to generate the invoice</p>
            <div className="mt-2 text-xs text-gray-400">
              Debug: {JSON.stringify({ 
                invoiceNumber: data.general.invoiceNumberValue,
                sellerName: data.seller.name,
                sellerAddress: data.seller.address,
                buyerName: data.buyer.name,
                buyerAddress: data.buyer.address,
                itemsCount: data.items.length
              })}
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  );
};
