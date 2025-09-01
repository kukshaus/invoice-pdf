'use client';

import React, { useEffect } from 'react';
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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreview]);

  return (
    <ClientOnly fallback={<div>Loading PDF components...</div>}>
      {showPreview ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl p-6 w-full h-full max-w-6xl max-h-[95vh] relative shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              <button
                onClick={onClosePreview}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="w-full h-[calc(100%-4rem)] border border-gray-200 rounded-lg overflow-hidden">
              <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                <InvoicePDF data={data} />
              </PDFViewer>
            </div>
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
