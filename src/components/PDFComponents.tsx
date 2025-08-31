'use client';

import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { X, Download } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

interface PDFComponentsProps {
  data: any;
  showPreview: boolean;
  onClosePreview: () => void;
}

export const PDFComponents: React.FC<PDFComponentsProps> = ({ 
  data, 
  showPreview, 
  onClosePreview 
}) => {
  return (
    <ClientOnly fallback={<div>Loading PDF components...</div>}>
      {showPreview ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full h-full max-w-4xl max-h-[90vh] relative">
            <button
              onClick={onClosePreview}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <InvoicePDF data={data} />
            </PDFViewer>
          </div>
        </div>
      ) : (
        <PDFDownloadLink
          document={<InvoicePDF data={data} />}
          fileName={`invoice-${data.general.invoiceNumber}.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <button
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <Download className="h-4 w-4" />
              <span>{loading ? 'Generating PDF...' : 'Generate PDF'}</span>
            </button>
          )}
        </PDFDownloadLink>
      )}
    </ClientOnly>
  );
};
